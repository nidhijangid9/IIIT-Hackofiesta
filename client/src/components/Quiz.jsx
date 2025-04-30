// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Quiz = () => {
//   const [templateContent, setTemplateContent] = useState('');

//   useEffect(() => {
//     const fetchTemplate = async () => {
//       try {
//         const response = await axios.get('http://127.0.0.1:8000/mcq/', {
//           headers: {
//             'Accept': 'text/html',
//           },
//         });
//         setTemplateContent(response.data);
//       } catch (error) {
//         console.error('Error fetching the template:', error);
//       }
//     };

//     fetchTemplate();
//   }, []);

//   return (
//     <div dangerouslySetInnerHTML={{ __html: templateContent }} />
//   );
// };

// export default Quiz;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Quiz = () => {
  const { lectureId } = useParams();
  const [templateContent, setTemplateContent] = useState('');

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        // Fetches quiz for the given lectureId
        const response = await axios.get(`http://127.0.0.1:8000/mcq/${lectureId}/`, {
          headers: { 'Accept': 'text/html' },
        });
        setTemplateContent(response.data);
      } catch (error) {
        console.error('Error fetching the template:', error);
      }
    };

    if (lectureId) {
      fetchTemplate();
    }
  }, [lectureId]);

  return (
    <div dangerouslySetInnerHTML={{ __html: templateContent }} />
  );
};

export default Quiz;