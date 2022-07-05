import React, { useState, useEffect } from "react";
import "./index.css";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import {
  AppLayout,
  Form,
  FormField,
  Select,
  Box,
  Header,
  HelpPanel,
  Button,
  Container,
  Link,
  SpaceBetween
} from "@awsui/components-react";
import { appLayoutLabels } from "../labels";
import Navigation from "../Navigation";
import Amplify, { Auth, API, graphqlOperation, Storage } from "aws-amplify";
import awsvideoconfig from "../../aws-video-exports";
import { getUserSubscriptionFilter } from "../../graphql/queries";
import { createUserSubscriptionFilter } from "../../graphql/mutations";
import { useNavigate } from "react-router-dom";
import { Navigate, Route } from "react-router-dom";

let User = {};
const Content = subscription => {
  console.log("CONTENT " + JSON.stringify(subscription));

  const navigate = useNavigate();
  let [category, setCategory] = useState({
    label: "All Categories",
    value: "All Categories"
  });
  const [timeframe, setTimeframe] = useState({
    label: "All Timeframes",
    value: "All Timeframes"
  });
  const uname = subscription.subscription.id;
  let cat = "All Categories";
  let tf = "All Timeframes";
  if (subscription.subscription.category) {
    cat = subscription.subscription.category;
  } 
  if (subscription.subscription.timeframe) {
    tf = subscription.subscription.timeframe;
  } 
   

  let categoryLabel =
    "Select new video category - current one is " +
    cat;
  let timeframeLabel =
    "Select new timeframe - current one is " +
    tf;
  const handleTimeChange = event => {
    console.log(
      "handleTimeChange" + JSON.stringify(event.detail.selectedOption.value)
    );
    setTimeframe(event.detail.selectedOption);
  };

  const handleCatChange = event => {
    console.log(
      "handleCatChange " + JSON.stringify(event.detail.selectedOption.value)
    );
    setCategory(event.detail.selectedOption);
  };

  const submitFormHandler = event => {
    event.preventDefault();
    const subscription = {
      id: uname,
      category: category.value,
      timeFrame: timeframe.value
    };

    console.log("API graphql update needed " + subscription);
    API.graphql(graphqlOperation(createUserSubscriptionFilter, subscription))
      .then((response, error) => {
        console.log("response " + JSON.stringify(response) + " ");
        alert("Subcription Changed");

        navigate("/App");
      })
      .catch(err =>
        console.log(
          `createUserSubscriptionFilter Error: ${JSON.stringify(err)}`
        )
      );
  };

  return (
    <div className="subscription">
      <Form
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={event => navigate("/")} variant="link">Cancel</Button>
            <Button
              onClick={event => submitFormHandler(event)}
              variant="primary"
            >
              Submit
            </Button>
          </SpaceBetween>
        }
      >
        <Container header={<Header variant="h2">Video Subscription</Header>}>
          <SpaceBetween direction="vertical" size="s">
            <FormField
              label={categoryLabel}
              errorText={!category && "No Category selected"}
            >
              <Select
                options={[
                  {
                    label: "All Categories",
                    value: "All Categories"
                  },
                  {
                    label: "Technical",
                    value: "Technical"
                  },
                  {
                    label: "Nature",
                    value: "Nature"
                  },
                  {
                    label: "Bizarre",
                    value: "Bizarre"
                  }
                ]}
                selectedOption={category}
                onChange={event => handleCatChange(event)}
                selectedAriaLabel="selected"
              />
            </FormField>
          </SpaceBetween>
          <SpaceBetween direction="vertical" size="s">
            <FormField
              label={timeframeLabel}
              errorText={!timeframe && "No Timeframe selected"}
            >
              <Select
                options={[
                  {
                    label: "All Timeframes",
                    value: "All Timeframes"
                  },
                  {
                    label: "Past 24 hrs",
                    value: "Past 24 hrs"
                  },
                  {
                    label: "Past 7 days",
                    value: "Past 7 days"
                  },
                  {
                    label: "Past 6 months",
                    value: "Past 6 months"
                  }
                ]}
                selectedOption={timeframe}
                onChange={event => handleTimeChange(event)}
                selectedAriaLabel="selected"
              />
            </FormField>
          </SpaceBetween>
        </Container>
      </Form>
    </div>
  );
};

const SideHelp = () => (
  <HelpPanel header={<h2>VOD Serverless Workshop</h2>}>
    <SpaceBetween size="m">
      <Box>
        Video On Demand (VOD) is a serverless workshop that incorporates various
        AWS services to create an application that allows users updload and view
        videos.
      </Box>
      <Box>
        <strong>Uploading</strong>
        <br /> . . .
      </Box>
    </SpaceBetween>
    <hr />
    <Box>
      <Header variant="h3">AWS Information</Header>
      <ul>
        <li>
          <Link href="https://aws.amazon.com/serverless/" external>
            AWS Serverless
          </Link>
        </li>
      </ul>
    </Box>
  </HelpPanel>
);

function Admin() {
  const [subscription, setSubscription] = useState({});
  const [lnavopen, setLnavopen] = useState(false);
  useEffect(() => {
    const region = awsvideoconfig.aws_cognito_region;

    Storage.configure({
      AWSS3: {
        bucket: awsvideoconfig.awsInputVideo,
        region,
        level: "public",
        customPrefix: {
          public: ""
        }
      }
    });

    let current_user = {
      isLoggedIn: false,
      isOperator: true,
      isAdmin: false,
      username: ""
    };
    Auth.currentAuthenticatedUser({
      bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      // Auth.currentSession()
      .then(user => {
        current_user.isLoggedIn = true;
        current_user.username = user.username;

        const cognitouser = {
          id: user.username
        };
        if (
          user.signInUserSession.idToken.payload["cognito:groups"] !=
          undefined
        )
          current_user.isAdmin = true;

        API.graphql(graphqlOperation(getUserSubscriptionFilter, cognitouser))
          .then((response, error) => {
            let category = "";
            let timeframe = "";
            let id = user.username;
            let sub = { id: id, category: category, timeframe: timeframe };

            if (response.data.getUserSubscriptionFilter === null) {

              setSubscription(sub);
            } else {
              sub.category = response.data.getUserSubscriptionFilter.category;
              sub.timeframe =
                response.data.getUserSubscriptionFilter.timeFrame;
              setSubscription(sub);

            }

            User = current_user;
          })
          .catch(err => {
            console.log(
              `getUserSubscriptionFilter Error: ${JSON.stringify(err)}`
            );
          });
      }).catch(err => {
        console.log(err)
      });

  }, []);

  return (
    <AppLayout
      disableContentPaddings={true}
      navigation={<Navigation User={User} />}
      content={<Content subscription={subscription} />}
      contentType="default"
      tools={<SideHelp />}
      navigationOpen={lnavopen}
      onNavigationChange={({ detail }) => setLnavopen(detail.open)}
      ariaLabels={appLayoutLabels}
    />
  );
}
export default (Admin)
