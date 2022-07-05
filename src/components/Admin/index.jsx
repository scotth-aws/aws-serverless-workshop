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
  Input,
  HelpPanel,
  Button,
  Container,
  Link,
  SpaceBetween
} from "@awsui/components-react";
import { appLayoutLabels, itemSelectionLabels } from "../labels";
import { AuthState } from "@aws-amplify/ui-components";
import Navigation from "../Navigation";
import Amplify, { Auth, API, graphqlOperation, Storage } from "aws-amplify";
import awsvideoconfig from "../../aws-video-exports";
import { createVodAsset, createVideoObject } from "../../graphql/mutations";
import { v4 as uuid } from "uuid";
import FilePicker from "../FilePicker";
import PopoverProgress from "../PopoverProgress";
import { useNavigate } from "react-router-dom";
import { Navigate, Route } from "react-router-dom";

const Content = User => {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState({});
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState({
    label: "Technical",
    value: "Technical"
  });
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleChange = event => {
    setTitle(event.target.value);
  };

  const handleCatChange = event => {
    setCategory(event.detail.selectedOption);
  };

  const myCallback = dataFromChild => {
    setName(dataFromChild.name);
    setFile(dataFromChild);
  };

  const handledescChange = event => {
    setDescription(event.target.value);
  };

  const submitFormHandler = event => {
    if (!name || !title || !description) {
      alert("title, description and filename must be entered");
      return true;
    } else {
      event.preventDefault();
      const videouuid = uuid();
      const adminPanel = this;
      const videoObject = {
        id: videouuid
      };
      let fileName = name;
      const fileExtension = fileName.toLowerCase().split(".");
      // Create the video object
      API.graphql(graphqlOperation(createVideoObject, videoObject)).then(
        (response, error) => {
          if (error === undefined) {
            const fileExtension = fileName.toLowerCase().split(".");

            const voduuid = uuid();
            const videoAsset = {
              id: voduuid,
              title: title,
              description: description,
              category: category.value,
              vodAssetVideoId: videouuid
            };

            Storage.put(
              `${videouuid}.${fileExtension[fileExtension.length - 1]}`,
              file,
              {
                progressCallback(progress) {
                  const { loaded, total } = progress;
                  setProgress((loaded / total) * 100);
                },
                contentType: "video/*"
              }
            )
              .then(() => {
                // Create the video asset metadata
                // TODO: this needs to happend after the media convert job is done not here
                // b/c video will not be ready
                //this.setState({ titleVal: '', descVal: '', progress: 0, name: '', file: {}, validate: false, })

                API.graphql(graphqlOperation(createVodAsset, videoAsset))
                  .then((vodresponse, error) => {
                    //console.log("videoAsset " + vodresponse);
                
                    setTitle("");
                    setDescription("");
                    setCategory("Technical");
                    setFile({});
                    setName("");
                    navigate("/");
                  })
                  .catch(err =>
                    console.log(
                      `videoAsset Error: ${err})` + JSON.stringify(err)
                    )
                  );
              })
              .catch(err => console.log(`Storage.put Error: ${err}`));
          } else {
            console.log("error !== undefined");
          }
        }
      );
    }
  };

  if (!User.User.isAdmin) {
    return null;
  } else {
    return (
      <div className="upload">
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
          <Container header={<Header variant="h2">Video Upload</Header>}>
            <SpaceBetween direction="vertical" size="s">
              <FormField label="Title" description="">
                <Input
                  value={title}
                  onChange={event => setTitle(event.detail.value)}
                  autoFocus={true}
                />
              </FormField>
            </SpaceBetween>
            <SpaceBetween direction="vertical" size="s">
              <FormField label="Description" description="">
                <Input
                  value={description}
                  onChange={event => setDescription(event.detail.value)}
                />
              </FormField>
            </SpaceBetween>
            <SpaceBetween direction="vertical" size="s">
              <FormField
                label="Select a video category"
                errorText={!category && "No Category selected"}
              >
                <Select
                  options={[
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

            <br />
            <FilePicker callbackFromParent={myCallback} />
            <br />
            <br />
            <PopoverProgress progress={progress} />
          </Container>
        </Form>
      </div>
    );
  }
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
  const [User, setUser] = useState({});
  const [lnavopen, setLnavopen] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(lnavopen);
  useEffect(() => {
    let current_user = {};
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

    current_user = {
      isLoggedIn: false,
      isOperator: true,
      isAdmin: false,
      username: ""
    };
    Auth.currentAuthenticatedUser({
      bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then(user => {
        current_user.isLoggedIn = true;
        current_user.username = user.username;
        if (
          user.signInUserSession.idToken.payload["cognito:groups"] !=
          undefined
        )
          current_user.isAdmin = true;
        setUser(current_user);
      }).catch(err => {
        console.log('currentAuthenticatedUser ' + err)
      });

  }, []);
  console.log("Admin rendering ");

  return (
    <AppLayout
      disableContentPaddings={true}
      navigation={<Navigation User={User} />}
      content={<Content User={User} />}
      contentType="default"
      tools={<SideHelp />}
      navigationOpen={lnavopen}
      onNavigationChange={({ detail }) => setLnavopen(detail.open)}
      ariaLabels={appLayoutLabels}
    />
  );
}
export default Admin;
//export default withAuthenticator(Admin);
