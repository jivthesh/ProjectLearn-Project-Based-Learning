import React, { Component } from "react";
import styled from "styled-components";

import ProjectList from "./ProjectList";

//Redux Stuff
import { connect } from "react-redux";
import { getProjects } from "../../../redux/actions/dataActions";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const ContentWrapper = styled.div`
  display: grid;
  height: 100vh;
  width: auto;
  grid-template-rows: 30vh auto;
  .dummy {
    position: fixed;
    z-index: -1;
    height: 30vh;
    width: 75vw;
    background: linear-gradient(90deg, var(${props => props.bg}), var(${props => props.bg}-alt));
  }
  .section-header {
    display: flex;
    background: linear-gradient(90deg, var(${props => props.bg}), var(${props => props.bg}-alt));
    color: ${props => props.color};
    .section-title {
      font-size: 5vh;
      padding: 4vh 4vh 0 4vh;
      font-weight: normal;
      margin: 0;
    }
    .section-sub-title {
      padding: 1vh 4vh;
      font-weight: 100;
    }
  }
  .search-container {
    margin-top: 5vh;
    margin-right: 5vh;
    margin-left: auto;
    .search-bar {
      padding: 1vh;
      font-size: 3vh;
      border-radius: 3vh;
      border: none;
      padding-left: 2.5vh;
      box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
      outline: none;
    }
  }
  .mobile-title {
    display: none;
  }
  .back-to-landing,
  .mobile-filter-reset {
    display: none;
  }
  @media only screen and (min-width: 320px) and (max-width: 480px) {
    .headers {
      display: none;
    }
    .dummy {
      width: 100vw;
    }
    .search-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 5vh auto;
    }
    .mobile-title {
      display: block;
      display: flex;
      justify-content: center;
      font-size: 4vh;
      margin-bottom: 2vh;
    }
    .mobile-filter-reset {
      display: block;
      display: flex;
      justify-content: center;
      font-size: 4.5vw;
      margin-top: 1.5vh;
      text-decoration: underline;
    }
    .search-bar {
      font-size: 2.5vh !important;
    }
    .back-to-landing {
      display: block;
      position: absolute;
      top: 1.5vh;
      left: 2vh;
      font-size: 3vh;
      cursor: pointer;
    }
  }
`;

class Content extends Component {
  state = {
    search: ""
  };

  updateSearch = event => {
    event.preventDefault();
    const query = event.target.value;
    this.setState(() => {
      return {
        search: query
      };
    });
  };

  resetSearch = () => {
    this.setState(() => {
      return {
        search: ""
      };
    });
  };

  render() {
    const categorySlug = this.props.slug;
    const categoryTitle = this.props.title;
    const url = this.props.url;

    let { projects } = this.props;

    projects = projects
      .filter(project => project.category.includes(categorySlug))
      .map(item => item);

    if (this.state.search != "") {
      projects = projects
        .filter(project => {
          return (
            project.title.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 ||
            project.tech.some(t => {
              return t.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
            }) === true
          );
        })
        .map(item => item);
    }

    return (
      <ContentWrapper bg={this.props.color}>
        <Link href="../../#categories">
          <div className="back-to-landing">
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
        </Link>
        <div className="dummy" />
        <div className="section-header">
          <div className="headers">
            <h1 className="section-title">{categoryTitle}</h1>
            <div className="section-sub-title">{projects ? projects.length : null} Projects</div>
          </div>

          <div className="search-container">
            <div className="mobile-title">{categoryTitle}</div>
            <input
              className="search-bar"
              type="text"
              value={this.state.search}
              onChange={this.updateSearch}
              placeholder="Search"
            />
            <Link href={{ pathname: `${url}` }}>
              <div className="mobile-filter-reset" onClick={() => this.resetSearch()}>
                Reset Filters
              </div>
            </Link>
          </div>
        </div>

        <ProjectList projects={projects} url={url} color={this.props.color}/>
      </ContentWrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    projects: state.data.projects
  };
};

export default connect(mapStateToProps, {})(Content);
