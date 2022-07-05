/* eslint-disable import/order */
import React, { Component } from "react";
import { Grid, Col, Row } from "react-styled-flexboxgrid";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
//import BottomScrollListener from 'react-bottom-scroll-listener';
import "./index.css";
import VideoPlayer from "../VideoPlayer";
import GridCardView from "../GridCardView";
import "video.js/dist/video-js.css";
import Amplify, { Auth, API, graphqlOperation, Storage } from "aws-amplify";
import awsvideoconfig from "../../aws-video-exports";
import * as queries from "../../graphql/queries";

import { onCreateVodAsset } from "../../graphql/subscriptions";
import { ThemeProvider } from 'styled-components'

const theme = {
  flexboxgrid: {
    // Defaults
    gridSize: 12, // columns
    gutterWidth: 1, // rem
    outerMargin: 0, // rem
    mediaQuery: 'only screen',
    container: {
      sm: 46, // rem
      md: 61, // rem
      lg: 76  // rem
    },
    breakpoints: {
      xs: 0,  // em
      sm: 48, // em
      md: 64, // em
      lg: 75  // em
    }
  }
}
let subscription = {};
class GridView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayingMovie: false,
      choosenItem: {},
      nextToken: "",
      sources: [],
      items: [],
      category: "",
      timeframe: "",
      username: "",
      ready: false,
      width: 0,
      height: 0
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.handleOnDocumentBottom = this.handleOnDocumentBottom.bind(this);
  }


  async componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    const region = awsvideoconfig.aws_appsync_region;
    Storage.configure({
      AWSS3: {
        bucket: awsvideoconfig.awsOutputVideo,
        region,
        level: "public",
        customPrefix: {
          public: ""
        }
      }
    });

    //


    Auth.currentAuthenticatedUser({
      bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => {

      const cognitouser = {
        id: user.signInUserSession.idToken.payload["cognito:username"]
      };

      API.graphql(
        graphqlOperation(queries.getUserSubscriptionFilter, cognitouser)
      )
        .then((response, error) => {

          //console.log('getUserSubscriptionFilter response  STOP '+response.data.getUserSubscriptionFilter);

          if (response.data.getUserSubscriptionFilter === null) {
            this.setState({ category: "0", timeframe: "0" });
          } else {
            this.setState({
              category: response.data.getUserSubscriptionFilter.category,
              timeframe: response.data.getUserSubscriptionFilter.timeFrame
            });
          }

          var d = this.findDate(this.state.timeframe);
          console.log("Filter " + response.data.getUserSubscriptionFilter);
          console.log("DATE Filter " + d);
          let f = {};

          if (
            response.data.getUserSubscriptionFilter === null
          ) {
            f = {
              filter: {
                createdAt: {
                  ge: d
                }
              }
            };
          } else {
            if (response.data.getUserSubscriptionFilter.category ===
              "All Categories") {
              f = {
                filter: {
                  createdAt: {
                    ge: d
                  }
                }
              };
            } else {
              f = {
                filter: {
                  category: {
                    eq: response.data.getUserSubscriptionFilter.category
                  },
                  createdAt: {
                    ge: d
                  }
                }
              }
            };
          }
          console.log('Subscription Filter ' + JSON.stringify(f));
          API.graphql(graphqlOperation(queries.listVodAssets, f))
            .then((response, error) => {
              //console.log(
              //  "listVodAssets " +
              //  JSON.stringify(response.data.listVodAssets.items)
              //);
              this.setState({
                items: response.data.listVodAssets.items,
                nextToken: response.data.listVodAssets.items.nextToken,
                ready: true
              });

              //TODO: pagination broken
              //let { nextToken } = response.data.listVodAssets;
              //if (nextToken === undefined) {
              //nextToken = '';
              //}

              this.listenForNewAssets();
            })
            .catch(error => {
              console.log(`listVodAssets Error: ${JSON.stringify(error)}`);
            });
         
        })
        .catch(error => {
          console.log(
            `getUserSubscriptionFilter Error: ${JSON.stringify(error)}`
          );
        });

    }).catch(err => {
      console.log(err);
    });


  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
    //subscription.unsubscribe();
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  findDate = tf => {

    var d = new Date();
    if (tf === "All Timeframes" || tf === "0") d.setMonth(d.getMonth() - 12);
    else if (tf === "Past 6 months") d.setMonth(d.getMonth() - 6);
    else if (tf === "Past 7 days") d.setMonth(d.getDay() - 8);
    else if (tf === "Past 24 hrs") d.setMonth(d.getDay() - 2);

    //console.log("Timeframe greater than ****** " + d.toISOString());
    return d.toISOString();
  };

  hideMovie = () => {
    this.setState({
      displayingMovie: false
    });
  };

  displayMovie = async item => {

    const region = awsvideoconfig.aws_appsync_region;
    const result = await Storage.get(
      item.vodAssetVideoId + "/" + item.vodAssetVideoId + "_3000.mp4",
      { level: "public" }
    );
    //console.log("Storage get key " + result);

    this.setState({
      sources: [
        {
          src: result
        }
      ],
      displayingMovie: true,
      choosenItem: item
    });
  };

  overlayMovie = () => {
    let w = this.state.width;
    let h = this.state.height;
    //console.log("overlayMovie " + w + " " + h);
    //console.log('overlayMovie '+JSON.stringify(this.props));
    const {
      displayingMovie,
      sources,
      choosenItem: { title, description }
    } = this.state;

    return (
      <div style={{
        padding: 5
      }}>
        <Modal
          id="popup"
          style={{ maxWidth: w, padding: 0 }}
          isOpen={displayingMovie}
          toggle={this.hideMovie}
        >
          <ModalHeader toggle={this.hideMovie}>{title}</ModalHeader>
          <ModalBody
            style={{
              display: "block",
              padding: 0
            }}
          >
            <VideoPlayer
              controls
              sources={sources}
              width={w - 20}
              height={h - 100}
              bigPlayButton={true}
              autoplay
            />
          </ModalBody>
        </Modal>
      </div>
    );
  };

  listenForNewAssets = () => {
    let dt = this.findDate('All Timeframes');
    let syncExpressionObject = {};
    if (this.state.category == "All Categories") {
      syncExpressionObject = {
        timeFrame: { ge: dt }
      };
    } else {
      syncExpressionObject = {
        category: { eq: this.state.category }
      };
    }
    const syncExpressionStr = JSON.stringify(syncExpressionObject);
    const variables = { filter: syncExpressionStr };

    subscription = API.graphql({
      query: onCreateVodAsset,
      variables: variables
    }).subscribe({
      next: data => {

        const { items } = this.state;
        items.push(data.value.data.onCreateVodAsset);
        this.setState({
          items
        });
      }
    });
  };

  async handleOnDocumentBottom() {
    // Insert Location 11
    const { nextToken, items } = this.state;
    if (nextToken !== "" && nextToken !== null && nextToken !== undefined) {
      console.log(nextToken);
      //
      // TODO: broken currenlty
      //
      //const assets = await API.graphql(graphqlOperation(queries.listVodAssets, { nextToken }));
      //const newItems = items.concat(assets.data.listVodAssets.items);
      //console.log('items ' + MediaKeySession.stringify(newItems));
      //let newNextToken = assets.data.listVodAssets.nextToken;
      //if (newNextToken === undefined) {
      //newNextToken = '';
      //}
      //this.setState({ items: newItems, nextToken: newNextToken });
    }
  }
  sayHello = () => {
    alert("You clicked me!");
  };

  render() {
    const { items } = this.state;
    //console.log('items '+items.length);
    const itemHTML = items.map(item => (
      <Col
        xs={5}
        sm={3}
        lg={1}
        style={{ paddingTop: 5, paddingBottom: 5, paddingLeft: 0 }}
        key={item.id}
      >
        <button
          type="button"
          onClick={e => this.displayMovie(item, e)}
          aria-label={item.title}
        >
          <GridCardView item={item} />
        </button>
      </Col>
    ));

    if (!this.state.ready) {
      return (
        <div style={{ paddingTop: 5 }}>
          <Grid fluid>
            <Row></Row>
          </Grid>
        </div>
      );
    } else {
      console.log("items " + items.length);
      if (items.length === 0) {
        const itemHTML =
          "No Videos available for this Subscirption, upload some or have an administrator load them ";
        return (
          <div style={{ paddingTop: 5 }}>
            <Grid fluid>
              <Row>{itemHTML}</Row>
            </Grid>
          </div>
        );
      } else {
        return (
          <div style={{ paddingBottom: 5 }}>
            <ThemeProvider theme={theme}>
              <Grid fluid>
                {this.overlayMovie()}
                <Row>{itemHTML}</Row>
              </Grid>
            </ThemeProvider>

          </div>
        );
      }
    }
  }
}
export default GridView;