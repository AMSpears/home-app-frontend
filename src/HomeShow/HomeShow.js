import React from "react";
import { Link } from "react-router-dom";
import MyMapComponent from "../MyMapComponent.js";
import axios from "axios";
import backend from "../BackendVariable";
import "./HomeShow.css";
import Section from "../Section";

class HomeShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      home: {
        _id: "",
        owner_id: "",
        street_address: "",
        unit: "",
        city: "",
        state: "",
        zipcode: "",
        num_bed: "",
        num_bath: "",
        sq_ft: "",
        img_url: "",
        price_range: "",
        type_rent_buy: "Rent"
      },
      errors: {},
      submitted: false,
      homeId: "",
      center: {}
    };
    this.getHome = this.getHome.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
  }
  componentDidMount() {
    this.getHome();
  }
  getHome() {
    axios
      .get(`${backend}api/homes/${this.props.match.params.id}`)
      .then(response => {
        this.setState(
          {
            home: response.data,
            homeId: response.data._id
          },
          () => this.getCoordinates()
        );
      });
  }
  getCoordinates() {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${
          this.state.home.street_address
        }${this.state.home.city}${this.state.home.state}${
          this.state.home.zipcode
        }&key=AIzaSyAWaxlS3Hg-U3SLUNPq6MjB2EKQp4eusps`
      )
      .then(response => {
        if (response.data.status !== "ZERO_RESULTS") {
          this.setState({
            center: response.data.results[0].geometry.location
          });
        } else {
          console.log("No results");
        }
      });
  }
  render() {
    if (this.state.home) {
      let unit = this.state.home.unit ? `, ${this.state.home.unit}` : "";
      let price =
        this.state.home.type_rent_buy === "Rent"
          ? `$${this.state.home.price_range} per month`
          : `Price: ${this.state.home.price_range}`;
      return (
        <Section>
          <div>
            <div className="home-show">
              <div className="image">
                <img src={this.state.home.img_url} alt="Home Image" />
              </div>
              <div className="map">
                {"lat" in this.state.center ? (
                  <MyMapComponent isMarkerShown center={this.state.center} />
                ) : (
                  <p />
                )}
              </div>
              <h3>
                {this.state.home.street_address}
                {unit}
              </h3>
              <p>
                {this.state.home.city}, {this.state.home.state}{" "}
                {this.state.home.zipcode}
              </p>
              <p>{price}</p>
              <p>
                {this.state.home.num_bed} beds - {this.state.home.num_bath}{" "}
                baths - {this.state.home.sq_ft} sqft
              </p>
              {this.props.userId === this.state.home.owner_id ? (
                <div className="buttom">
                  <Link to={`/homes/${this.state.home._id}/edit`}>
                    Edit Home
                  </Link>
                  <Link to={`/homes/${this.state.home._id}/delete`}>
                    Delete Home
                  </Link>
                </div>
              ) : (
                <p />
              )}
            </div>
          </div>
        </Section>
      );
    } else {
      return (
        <Section>
          {" "}
          <p>Loading...</p>
        </Section>
      );
    }
  }
}
export default HomeShow;
