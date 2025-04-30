import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listMentors } from '../../actions/projectActions';
import { motion } from 'framer-motion';

const cardVariants = {
    hidden: { opacity: 0, scale: 0.5 },  // Starts small to simulate distance
    visible: (i) => ({
        opacity: 1,
        scale: 1,
        transition: {
            delay: 0.5,
            duration: 1,
            type: 'spring',
        },
    }),
};

const MentorsList = () => {
    const dispatch = useDispatch();

    const mentorsList = useSelector((state) => state.mentorsList);
    const { loading, error, mentors } = mentorsList;

    useEffect(() => {
        dispatch(listMentors());
    }, [dispatch]);

    return (
        <div className='px-20 h-screen'>
            <h2 className="text-5xl font-bold text-center pt-5 font-serif">Learn From <span className='text-blue-900'>Your </span>Mentors</h2>

            {loading ? (

                <div role="status" className='flex justify-center items-center'>
                    <svg aria-hidden="true" class="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-gray-800" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span class="sr-only">Loading...</span>
                </div>

            ) : error ? (
                <p className="text-red-500">Error: {error}</p>
            ) : (
                <div className='mt-12 flex justify-center gap-10 flex-wrap'>
                    {mentors.map((mentor, index) => (
                        <motion.div
                            key={mentor.id}
                            className='w-[23vw] h-[55vh] px-4 flex flex-col items-center justify-around border border-gray-500 shadow-xl rounded-4xl bg-gray-100'
                            custom={index}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            style={{ perspective: '1000px', transformOrigin: 'center' }}  // Adding perspective for a 3D feel
                        >
                            <div className='w-[120px] h-[120px] rounded-full border bg-black'></div>
                            <h3 className='text-3xl font-semibold text-gray-800'>{mentor.name}</h3>
                            <p className='text-sm text-gray-600 text-center'>{mentor.bio}</p>
                            <p className='text-gray-600'>Expertise: {mentor.expertise}</p>
                            <Link className='w-1/2 bg-gray-600 text-white font-medium py-2 rounded-full hover:bg-gray-800 text-center' to={`/core_learning/mentor/${mentor.id}`}>
                                View Details
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MentorsList;
