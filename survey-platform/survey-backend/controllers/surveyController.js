const Survey = require('../models/Survey');

exports.createSurvey = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const survey = await Survey.create({
      user_id: req.user.user_id,
      title,
      description,
      questions
    });

    res.status(201).json({
      success: true,
      message: 'Survey created successfully',
      data: { survey }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create survey' });
  }
};


exports.getSurveys = async (req, res) => {
  try {
    const filters = { user_id: req.user.user_id };
    if (req.query.status) filters.status = req.query.status;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Survey.countDocuments(filters);
    const surveys = await Survey.find(filters).skip(skip).limit(limit);

    res.json({
      success: true,
      data: {
        surveys,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_items: total,
          items_per_page: limit
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch surveys' });
  }
};


exports.getSurveyById = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ success: false, message: 'Survey not found' });
    if (!survey.user_id.equals(req.user.user_id)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.json({ success: true, data: { survey } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get survey' });
  }
};


exports.updateSurvey = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    const survey = await Survey.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.user_id },
      { title, description, questions, updated_at: Date.now() },
      { new: true }
    );

    if (!survey) return res.status(404).json({ success: false, message: 'Survey not found or unauthorized' });

    res.json({ success: true, message: 'Survey updated successfully', data: { survey } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update survey' });
  }
};


exports.deleteSurvey = async (req, res) => {
  try {
    const result = await Survey.findOneAndDelete({ _id: req.params.id, user_id: req.user.user_id });

    if (!result) return res.status(404).json({ success: false, message: 'Survey not found or unauthorized' });

    res.json({ success: true, message: 'Survey deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete survey' });
  }
};


exports.publishSurvey = async (req, res) => {
  try {
    const survey = await Survey.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.user_id },
      { status: 'active', published_at: Date.now() },
      { new: true }
    );

    if (!survey) return res.status(404).json({ success: false, message: 'Survey not found or unauthorized' });

    res.json({
      success: true,
      message: 'Survey published successfully',
      data: { survey }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to publish survey' });
  }
};
