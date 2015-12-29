class FeedbackManager {

    handleFeedback(feedback) {
        console.log(feedback);
    }

}

export default store => new FeedbackManager(store);
