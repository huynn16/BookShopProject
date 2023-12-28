import React from 'react';

export default React.createContext({
  currentLessonData: {
    cateLesson: 'Sách cổ',
    author: 'Nguyên Huy',
    image: 'Sách cổ',
    length: 312,
    title: 'Sách cổ',
    content: 'abc',
    data: {id: 1},
    bookId: 1,
  },
  bookId: 1,
  isLoading: true,
  showLessonBar: true,
  user_id: 1,
  full_name: 'Nguyễn Ngọc Huy',
  username: 'Thành viên bạc',
  verified: false,
  topicSpeakingCurrent: []
});
