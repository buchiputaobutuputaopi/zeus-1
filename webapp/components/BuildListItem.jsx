import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import styled from 'styled-components';
import {Flex, Box} from 'grid-styled';
import Transition from 'react-transition-group/Transition';

import BuildAuthor from './BuildAuthor';
import BuildCoverage from './BuildCoverage';
import ObjectDuration from './ObjectDuration';
import ObjectResult from './ObjectResult';
import ResultGridRow from './ResultGridRow';
import TimeSince from './TimeSince';

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0
};

const transitionStyles = {
  entering: {opacity: 1},
  entered: {opacity: 1}
};

const Fade = ({children, in: inProp}) =>
  <Transition in={inProp} timeout={duration}>
    {state =>
      <div
        style={{
          ...defaultStyle,
          ...transitionStyles[state]
        }}>
        {children}
      </div>}
  </Transition>;

export default class BuildListItem extends Component {
  static propTypes = {
    build: PropTypes.object.isRequired,
    initialLoad: PropTypes.bool
  };

  renderItem() {
    let {build} = this.props;
    let repo = build.repository;
    return (
      <BuildListItemLink to={`/${repo.full_name}/builds/${build.number}`}>
        <ResultGridRow>
          <Flex align="center">
            <Box flex="1" width={8 / 12} pr={15}>
              <Flex>
                <Box width={15} mr={8}>
                  <ObjectResult data={build} />
                </Box>
                <Box flex="1" style={{minWidth: 0}}>
                  <Message>
                    #{build.number} {build.source.revision.message.split('\n')[0]}
                  </Message>
                  <Meta>
                    <Commit>
                      {build.source.revision.sha.substr(0, 7)}
                    </Commit>
                    <Author>
                      <BuildAuthor build={build} />
                    </Author>
                  </Meta>
                </Box>
              </Flex>
            </Box>
            <Box width={1 / 12} style={{textAlign: 'center'}}>
              <ObjectDuration data={build} short={true} />
            </Box>
            <Box width={1 / 12} style={{textAlign: 'center'}}>
              <BuildCoverage build={build} />
            </Box>
            <Box width={2 / 12} style={{textAlign: 'right'}}>
              <TimeSince date={build.created_at} />
            </Box>
          </Flex>
        </ResultGridRow>
      </BuildListItemLink>
    );
  }

  render() {
    let {initialLoad} = this.props;
    if (!initialLoad) {
      return (
        <Fade in={true}>
          {this.renderItem()}
        </Fade>
      );
    }
    return this.renderItem();
  }
}

const BuildListItemLink = styled(Link)`
  display: block;

  &:hover {
    background-color: #F0EFF5;
  }

  &.${props => props.activeClassName} {
    color: #fff;
    background: #7B6BE6;

    > div {
      color: #fff !important;

      svg {
        color: #fff;
        opacity: .5;
      }
    }
  }
`;

BuildListItemLink.defaultProps = {
  activeClassName: 'active'
};

const Message = styled.div`
  font-size: 15px;
  line-height: 1.2;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Author = styled.div`
  font-family: "Monaco", monospace;
  font-size: 12px;
  font-weight: 600;
`;

const Commit = styled(Author)`
  font-weight: 400;
`;

const Meta = styled.div`
  display: flex;
  font-size: 12px;
  color: #7f7d8f;

  > div {
    margin-right: 12px;

    &:last-child {
      margin-right: 0;
    }
  }

  svg {
    vertical-align: bottom !important;
    margin-right: 5px;
    color: #bfbfcb;
  }
`;
