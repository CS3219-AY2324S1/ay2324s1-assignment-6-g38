const axios = require('axios');

const getQuestionList = async () => {
  const endpoint = 'https://leetcode.com/graphql';
  const graphqlQuery = {
    query: `
      query getQuestionList {
        allQuestions {
          title
          titleSlug
          questionId
          difficulty
          content
          topicTags {
            name
          }
        }
      }
    `,
  };
  try {
    const response = await axios.post(endpoint, graphqlQuery, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.data.allQuestions; // Assuming the data you want is in the `data.allQuestions` path
  } catch (error) {
    console.error('Error fetching question list:', error);
    return null;
  }
};

const populateQuestionDatabase = async () => {
  try {
    const questions = await getQuestionList(); // Await the result of getQuestionList
    if (!questions) {
      throw new Error('Failed to get questions');
    }
    const questionServiceEndpoint = "http://localhost:5001/question/";
    for (const question of questions) {
      const formattedQuestion = {
        title: question.title,
        categories: question.topicTags.map(tag => tag.name), // Assuming topicTags is an array of objects with a name property
        difficulty: question.difficulty,
        description: question.content,
        link: `https://leetcode.com/problems/${question.titleSlug}/` // Assuming there's a titleSlug or similar property
      };
      if (formattedQuestion.title == null || formattedQuestion.description == null) {
        continue
      }
      try {
        await axios.post(questionServiceEndpoint, formattedQuestion);
      } catch (e) {
        console.log(e)
      }
    }
  //   // console.log(questions[0]); // Log or handle the response from your question service
  } catch (error) {
    console.error('Error populating question database:', error);
  }
};

populateQuestionDatabase(); // Call the function to populate the database

