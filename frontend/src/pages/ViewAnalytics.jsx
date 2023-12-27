import React from 'react';
import ViewAnalyticsForm from "../components/viewAnalyticsForm";
import Header from "../components/Header";

const ViewAnalytics = () => {
    const goBack = () => {
        window.history.back();
    }

    return (
        <>
            <Header>
                <button className="btn" onClick={goBack}>
                    to dashboard
                </button>
            </Header>      
            <section className="heading">
                <p className="heading__subtitle">Analytics</p>
            </section>
            <ViewAnalyticsForm />
        </>
    );
};

export default ViewAnalytics;