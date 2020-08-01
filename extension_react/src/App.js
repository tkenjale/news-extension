import React from 'react';
import './App.css';
import axios from 'axios';

/*global chrome*/

const Header = () => {
  return (
    <div className="container text-center">
      <h1 className="mb-0">CHECC</h1>
      <h2 className="mt-n2">news</h2>
    </div>
  );
}

const Checc = (props) => {
  return (
    <div className="checc_div container-fluid text-center pt-2">
      <button type="button" className="submit_btn btn btn-block btn-light text-center" id="checc" style={{borderRadius: 30}} onClick={props.handler}>
        <span id="checc_span" className="pt-0 pb-0" style={{fontSize: "large", color: "black"}}>Submit</span>
      </button>
    </div>
  );
}

const Score = (props) => {
  return (
    <div className="score_div container-fluid text-center mt-3">
      <div className="progress position-relative text-center" style={{height: 30, borderRadius: 30}}>
        <div className={props.progress_bar_class} role="progressbar" style={{width: props.score + '%'}}></div>
        <p className="progress-bar-title text-dark font-italic font-weight-bold">{props.score + '% Reliable'}</p>
      </div>
    </div>
  );
}

const Error = () => {
  return (
    <div className="unsupported_div container-fluid text-center mt-5 pt-1">
        <span className="badge badge-danger">This site is not supported</span>
    </div>
  );
}

const Feedback = (props) => {
  return (
    <div className="feedback_div container-fluid text-center mt-3">
      <p className="small" id="question">Is this article actually reliable?</p>
      <div className="feedback_btn container-fluid mt-n1 mb-0">
          <button type="button" className="yesOrNo btn btn-sm btn-success mt-0 mr-1" id="yesOrNo" style={{borderRadius: 30}} onClick={props.handleYes}>Yes</button>
          <button type="button" className="yesOrNo btn btn-sm btn-danger mt-0 ml-1" id="yesOrNo" style={{borderRadius: 30}} onClick={props.handleNo}>No</button>
      </div>
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      url: "",
      checc_click: false,
      feedback_click: false,
      error: false
    }

    this.handleCheccClick = this.handleCheccClick.bind(this);
    this.handleYes = this.handleYes.bind(this);
    this.handleNo = this.handleNo.bind(this);
  }

  handleCheccClick() {
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

      this.setState({ url: tabs[0].url });     

      // axios.post('http://127.0.0.1:5000/predict', {url : this.state.url}, {'Content-Type': 'application/json'})
      //   .then(res => {

      //     this.setState({ 
      //       data: res.data ,
      //       checc_click: true
      //     });

      //   }).catch(error => {
      //     if (error.response) {
      //       console.log("error received");
      //       this.setState({ 
      //         error: true ,
      //         checc_click: true
      //       });
      //     }
      //   });

      this.setState({
        data: {combined_prob : 75},
        checc_click: true
      });
    });
  }

  handleYes() {
    this.setState({ feedback_click: true });
  }

  handleNo() {
    this.setState({ feedback_click: true });
  }

  render() {
    if (!this.state.checc_click && !this.state.feedback_click) {
      return (
        <div>
          <Header />
          <h3 className="small pt-2 pb-2 font-italic text-center" id="instructions">Click the button to predict how reliable a news article is</h3>
          <Checc handler={this.handleCheccClick} />
        </div>
      );
    } 
    else if (this.state.checc_click && !this.state.feedback_click) {
      if (this.state.error) {
        return (
          <div>
            <Header />
            <Error />
          </div>
        );
      }
      else {
        let prob = this.state.data.combined_prob;
        let progress_bar_class = "progress-bar progress-bar-striped progress-bar-animated ";

        if (prob >= 70) {
          progress_bar_class += "bg-success";
        } else if (prob >= 40) {
          progress_bar_class += "bg-warning";
        } else {
          progress_bar_class += "bg-danger";
        }

        return (
          <div>
            <Header />
            <Score score={this.state.data.combined_prob} progress_bar_class={progress_bar_class} />
            <Feedback handleYes={this.handleYes} handleNo={this.handleNo} />
          </div>
        );
      }
    }
    else if (this.state.checc_click && this.state.feedback_click) {
      return (
        <div>
          <Header />
          <p className="small mt-2 pt-4 text-center" id="thanks">Thanks for the feedback!</p>
        </div>
      );
    }
  }
}

export default App;
