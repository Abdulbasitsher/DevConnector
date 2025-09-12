import Profile from "../../models/Profile.js";
import express from "express";
import auth from "../../middleware/auth.js";

const router = express.Router();

/**
 * @route   GET /api/profile/me
 * @desc    Get current user's profile
 * @access  Private
 */
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(404).json({ msg: "Profile doesn't exist" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route   POST /api/profile
 * @desc    Create or update a user profile
 * @access  Private
 */
router.post("/", auth, async (req, res) => {
  const {
    company,
    website,
    location,
    status,
    skills,
    bio,
    githubUsername,
    social
  } = req.body;

  // Build profile object
  const profileFields = {};
  profileFields.user = req.user.id;
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (status) profileFields.status = status;
  if (bio) profileFields.bio = bio;
  if (githubUsername) profileFields.githubUsername = githubUsername;

  if (skills) {
    profileFields.skills = Array.isArray(skills)
      ? skills
      : skills.split(",").map((skill) => skill.trim());
  }

  // Build social object
  profileFields.social = {};
  if (social) {
    if (social.twitter) profileFields.social.twitter = social.twitter;
    if (social.facebook) profileFields.social.facebook = social.facebook;
    if (social.instagram) profileFields.social.instagram = social.instagram;
    if (social.youtube) profileFields.social.youtube = social.youtube;
    if (social.linkedIn) profileFields.social.linkedIn = social.linkedIn;
  }

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // Create
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


/**
 * @route   GET /api/profile
 * @desc    Get all profiles
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route   GET /api/profile/user/:user_id
 * @desc    Get profile by user ID
 * @access  Public
 */
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    // If invalid ObjectId
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server error");
  }
});

/**
 * @route   delete /api/profile
 * @desc    delete profile , user
 * @access  private
 */
router.delete("/", auth, async (req, res) => {
  try {
    // Remove profile
    await Profile.findOneAndDelete({ user: req.user.id });

    // Remove user
    await User.findOneAndDelete({ _id: req.user.id });

    res.json({ msg: "User and profile deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


/**
 * @route   PUT /api/profile/experience
 * @desc    Add profile experience
 * @access  Private
 */
router.put("/experience", auth, async (req, res) => {
  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body;

  const newExp = { title, company, location, from, to, current, description };

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    // Add experience at start of array
    profile.experience.unshift(newExp);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route   DELETE /api/profile/experience/:exp_id
 * @desc    Delete profile experience
 * @access  Private
 */
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    // Remove experience by ID
    profile.experience = profile.experience.filter(
      (exp) => exp.id.toString() !== req.params.exp_id
    );

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route   PUT /api/profile/education
 * @desc    Add profile education
 * @access  Private
 */
router.put("/education", auth, async (req, res) => {
  const {
    school,
    degree,
    fieldOfStudy,
    from,
    to,
    current,
    description
  } = req.body;

  const newEdu = { school, degree, fieldOfStudy, from, to, current, description };

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    // Add education at start of array
    profile.education.unshift(newEdu);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route   DELETE /api/profile/education/:edu_id
 * @desc    Delete profile education
 * @access  Private
 */
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    // Remove education by ID
    profile.education = profile.education.filter(
      (edu) => edu.id.toString() !== req.params.edu_id
    );

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// // @route GET api/profile/github/:username
// // @desc GET user repos from github 
// // @access public

// router.get("/github/:username", (req, res ) => {

// })
export default router;
