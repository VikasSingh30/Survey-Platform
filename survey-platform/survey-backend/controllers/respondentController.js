const Respondent = require('../models/Respondent');
const Response = require('../models/Response');
const Survey = require('../models/Survey');


exports.getAllRespondents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    
    const userSurveys = await Survey.find({ user_id: req.user.user_id }, '_id');
    const surveyIds = userSurveys.map(s => s._id);

    
    const responses = await Response.find({ survey_id: { $in: surveyIds } });

    
    const respondentStats = {};
    responses.forEach(r => {
      const id = r.respondent_id.toString();
      if (!respondentStats[id]) {
        respondentStats[id] = { count: 0, last: r.completed_at };
      }
      respondentStats[id].count++;
      if (r.completed_at > respondentStats[id].last) {
        respondentStats[id].last = r.completed_at;
      }
    });

    const allRespondentIds = Object.keys(respondentStats);

    const total = allRespondentIds.length;
    const paginatedIds = allRespondentIds.slice(skip, skip + limit);
    const respondents = await Respondent.find({ _id: { $in: paginatedIds } });

    const enriched = respondents.map(r => ({
      id: r._id,
      email: r.email,
      name: r.name,
      surveys_completed: respondentStats[r._id]?.count || 0,
      last_response_at: respondentStats[r._id]?.last || null,
      created_at: r.created_at
    }));

    res.json({
      success: true,
      data: {
        respondents: enriched,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_items: total,
          items_per_page: limit
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch respondents' });
  }
};


exports.getRespondentDetails = async (req, res) => {
  try {
    const respondent = await Respondent.findById(req.params.id);
    if (!respondent) return res.status(404).json({ success: false, message: 'Respondent not found' });

    
    const userSurveys = await Survey.find({ user_id: req.user.user_id }, '_id title');
    const surveyMap = userSurveys.reduce((acc, s) => {
      acc[s._id] = s.title;
      return acc;
    }, {});

    
    const responses = await Response.find({
      respondent_id: respondent._id,
      survey_id: { $in: Object.keys(surveyMap) }
    });

    const responseHistory = responses.map(r => ({
      id: r._id,
      survey_id: r.survey_id,
      survey_title: surveyMap[r.survey_id],
      completed_at: r.completed_at
    }));

    res.json({
      success: true,
      data: {
        respondent: {
          id: respondent._id,
          email: respondent.email,
          name: respondent.name,
          metadata: respondent.metadata,
          surveys_completed: responseHistory.length,
          responses: responseHistory,
          created_at: respondent.created_at
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch respondent details' });
  }
};
