const Survey = require('../models/Survey');
const Respondent = require('../models/Respondent');
const Response = require('../models/Response');


exports.getPublicSurvey = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey || survey.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Survey not found or not published' });
    }

    res.json({
      success: true,
      data: {
        survey: {
          id: survey._id,
          title: survey.title,
          description: survey.description,
          questions: survey.questions
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching survey' });
  }
};


exports.submitResponse = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey || survey.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Survey not found or not published' });
    }

    const { respondent, answers } = req.body;

    let respondentDoc = await Respondent.findOne({ email: respondent.email });
    if (!respondentDoc) {
      respondentDoc = await Respondent.create({
        email: respondent.email,
        name: respondent.name
      });
    }

    const newResponse = await Response.create({
      survey_id: survey._id,
      respondent_id: respondentDoc._id,
      answers,
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    });

    res.status(201).json({
      success: true,
      message: 'Response submitted successfully',
      data: { response_id: newResponse._id }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error submitting response' });
  }
};
