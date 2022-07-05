import React, { useState, useEffect } from "react";
import "./App.css";
import GridView from "../GridView";
import Admin from "../Admin";
import { Auth, API, graphqlOperation } from "aws-amplify";
import awsvideoconfig from "../../aws-video-exports";
import { getUserSubscriptionFilter } from "../../graphql/queries";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
//import { Link } from "react-router-dom";
import {
  AppLayout,
  Grid,
  Box,
  Header,
  HelpPanel,
  Container,
  Cards,
  Link,
  SpaceBetween
} from "@awsui/components-react";
import { appLayoutLabels, itemSelectionLabels } from "../labels";
import Navigation from "../Navigation";

const Content = () => {
  const LOGIN_TYPE_NONE = "LOGIN_TYPE_NONE";
  const LOGIN_TYPE_CREATE = "LOGIN_TYPE_CREATE";
  const LOGIN_TYPE_LOGIN = "LOGIN_TYPE_LOGIN";


  return (
    <Container header={<Header variant="h2">Video Feed</Header>}>
      <Box margin={{ bottom: "s" }}>
        <Grid>
          <Box>
            <GridView />
          </Box>
        </Grid>
      </Box>
    </Container>
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
        <strong>Viewing</strong>
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

function App() {
  const [User, setUser] = useState({});
  const [lnavopen, setLnavopen] = useState(false);
  //const [navigationOpen, setNavigationOpen] = useState(lnavopen);

  useEffect(() => {

    let current_user = {};
    current_user = {
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
        current_user.username = user.signInUserSession.idToken.payload["cognito:username"];
        if (
          //user.signInUserSession.idToken.payload["cognito:groups"] !=
          user.signInUserSession.idToken.payload["cognito:groups"] !=
          undefined
        )
        current_user.isAdmin = true;
        setUser(current_user);
      }).catch(err => {
        console.log('Auth.currentSession ' + err);
      });

  }, []);
  console.log("App rendering" + JSON.stringify(User));
 
    return (
      <AppLayout
        disableContentPaddings={true}
        navigation={<Navigation User={User} />}
        content={<Content />}
        contentType="default"
        tools={<SideHelp />}
        navigationOpen={lnavopen}
        //onNavigationChange={({ detail }) => console.log('onNavigationChange '+JSON.stringify(detail))}
        onNavigationChange={({ detail }) => setLnavopen(detail.open)}
        ariaLabels={appLayoutLabels}
      />
    );

}


export default withAuthenticator(App);
