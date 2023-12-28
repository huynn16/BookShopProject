import React from 'react';
import PropTypes from 'prop-types';

// context
import Context from './index';

class AppState extends React.Component {
  constructor() {
    super();

    this.state = {
      currentLessonData: {
        cateLesson: 'cam17',
        author: 'Nguyễn Huy',
        image: 'cam17',
        length: 312,
        title: 'Cam 17',
        content: 'abc',
        data: {id: 1}

      },
      isLoading: true,
      showLessonBar: false,
      user_id: 1,
      full_name: 'Nguyen Ngoc Huy',
      username: 'Thành viên bạc',
      verified: false,
      topicSpeakingCurrent: []
    };

    this.updateState = this.updateState.bind(this);
  }

  updateState(key, value) {
    this.setState({
      [key]: value
    });
  }

  render() {
    const { children } = this.props;

    // app state
    const { currentLessonData, isLoading, showLessonBar, user_id, full_name, username, verified, topicSpeakingCurrent} = this.state;

    return (
      <Context.Provider
        value={{
          currentLessonData,
          isLoading,
          showLessonBar,
          updateState: this.updateState,
          user_id, 
          full_name,
          username,
          verified,
          topicSpeakingCurrent
        }}
      >
        {children}
      </Context.Provider>
    );
  }
}

AppState.propTypes = {
  // required
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default AppState;