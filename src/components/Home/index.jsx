import React, { useState, useEffect } from "react";
import "./Home.css";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
//import { Link } from "react-router-dom";
import research from './research.jpg';
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
 
    return (
      <Container header={<Header variant="h2">OnPrem Research</Header>}>
        <Box margin={{ bottom: "s" }}>
          <Grid>
            <Box>
              Welcome to the video on demand platform that's supports multiple research programs. Select the menu icon on the top left for features and the help icon on the top right for help navigating the site.
            </Box>
          </Grid>
          <Box>
            <br/>
            <br/>
          <img src={research} alt="logo" className="center"/>
          </Box>
        </Box>
      </Container>
    );
 
};

const SideHelp = () => (
  <HelpPanel header={<h2>VOD Serverless Workshop</h2>}>
    <SpaceBetween size="m">
      <Box>
        Video On Demand (VOD) is a serverless workshop that incorporates various
        AWS services to create an application that allows users to updload and view
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
 

  useEffect(() => {

    let current_user = {};
    current_user = {
      isLoggedIn: false,
      isOperator: true,
      isAdmin: false,
      username: ""
    };
   
    Auth.currentSession()
      .then(user => {
      
        current_user.isLoggedIn = true;
        current_user.username = user.idToken.payload["cognito:username"];
        if (
          //user.signInUserSession.idToken.payload["cognito:groups"] !=
          user.idToken.payload["cognito:groups"] !=
          undefined
        )
          current_user.isAdmin = true;
        setUser(current_user);

      }).catch(err => {
        console.log('Auth.currentSession ' + err);
      });

  }, []);
  console.log("Home Rendering " + JSON.stringify(User.username));
 
  if ( User.username === undefined) {
    return null;
  } else {
    return (
      <AppLayout
        disableContentPaddings={true}
        navigation={<Navigation User={User} />}
        content={<Content/>}
        contentType="default"
        tools={<SideHelp />}
        navigationOpen={lnavopen}
        //onNavigationChange={({ detail }) => console.log('onNavigationChange '+JSON.stringify(detail))}
        onNavigationChange={({ detail }) => setLnavopen(detail.open)}
        ariaLabels={appLayoutLabels}
      />
    );
  }



}


export default withAuthenticator(App);
