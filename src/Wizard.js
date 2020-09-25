import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import StepTabs from './StepTabs';

class Wizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStepIndex: 0,
      totalSteps: this.getTotalSteps(props.children),
      stepTabs: [],
    };
  }

  getTotalSteps(children) {
    let totalSteps = 0;
    Children.forEach(children, child => {
      if (child.type.displayName === 'StepsList') {
        totalSteps = child.props.children.length - 1;
      }
    });
    return totalSteps;
  }

  onPreviousStep = () => {
    this.setState({
      activeStepIndex: this.state.activeStepIndex - 1,
    });
  };

  onNextStep = () => {
    this.setState({
      activeStepIndex: this.state.activeStepIndex + 1,
    });
  };

  onSubmit = () => {
    console.log('submitted the form');
  };

  updateStepTabs = stepTabs => {
    this.setState({
      stepTabs,
    });
  };

  getInitialComponents() {
    const { children, ...props } = this.props;

    const stepsChild= Children.toArray(children).find(child => child.type.displayName === 'StepsList');
    const stepsComponent = cloneElement(stepsChild, {
      activeStepIndex: this.state.activeStepIndex,
      updateStepTabs: this.updateStepTabs,
      ...props,
    });
    const validators = stepsChild.props.validators;
    const childrenProps = {
      activeStepIndex: this.state.activeStepIndex,
      totalSteps: this.state.totalSteps,
      onSubmit: this.onSubmit,
      onNextStep: this.onNextStep,
      onPreviousStep: this.onPreviousStep,
      validators,
      ...props,
    };

    const otherComponents = Children.map(children, child => {
      if (child.type.displayName !== 'StepsList') {
        return cloneElement(child, childrenProps);
      }
    });

    return [stepsComponent, ...otherComponents];
  }

  render() {
    const { className } = this.props;
    const components = this.getInitialComponents();
    return (
      <div
        className={cx('react-formik-wizard', {
          [className]: !!className,
        })}
      >
        <StepTabs
          tabs={this.state.stepTabs}
          activeStepIndex={this.state.activeStepIndex}
        />
        {components}
      </div>
    );
  }
}

Wizard.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

Wizard.displayName = 'Wizard';

export default Wizard;
