import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import VisualComposerIcon from '@material-ui/icons/Visibility';
import CodeComposerIcon from '@material-ui/icons/Code';
import JsonEditor from '../JsonEditor';
import ConfigRestRequest from '../ConfigRestRequest';
import ConfigSchedule from '../ConfigSchedule';
import Form from '../../layouts/Form';
import FormSection from '../../layouts/FormSection';
import FormControl from './components/FormControl';
import TextField from './components/TextField';

const useStyles = makeStyles(theme => ({
  taskInfo: {
    marginBottom: theme.spacing(3),
  },
}));

const TaskDetailsForm = ({ edit, value, errors, onSubmit, onCancel }) => {
  const classes = useStyles();

  const [currentValue, setCurrentValue] = useState({
    group_name: '',
    task_name: '',
    description: '',
    schedule: {
      method: 'delay',
      value: '',
    },
    action: {
      method: 'webhook',
      request: {
        type: 'rest',
        method: 'GET',
        url: '',
        headers: {},
        body: {},
      },
    },
    payload: {},
  });

  const [currentErrors, setCurrentErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useVisualComposer, setUseVisualComposer] = useState(true);

  // Intake values from the properties into the internal state management.
  useEffect(() => {
    setCurrentValue(JSON.parse(JSON.stringify(value)));
  }, [value, setCurrentValue]);

  // Intake errors from the properties into the internal state management.
  useEffect(() => {
    setCurrentErrors(errors);
  }, [errors, setCurrentErrors]);

  const onChangeProp = prop => evt => {
    setCurrentValue({
      ...currentValue,
      [prop]: evt.target.value,
    });
  };

  const updateRequestValue = (evt, json) => {
    const update = {
      ...currentValue,
      action: {
        method: 'webhook',
        request: {
          type: 'rest',
          ...json,
        },
      },
    };
    update.action.request.type = 'rest';
    setCurrentValue(update);
  };

  const updateScheduleValue = (evt, schedule) =>
    setCurrentValue({ ...currentValue, schedule });

  const handleSubmit = async evt => {
    evt.preventDefault();

    setIsLoading(true);
    setCurrentErrors([]);
    try {
      await onSubmit(null, JSON.parse(JSON.stringify(currentValue)));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = evt => {
    evt.preventDefault();
    onCancel(evt);
  };

  // Error helpers
  const hasError = field => currentErrors.some(err => err.field === field);
  const getErrorMessage = field =>
    currentErrors
      .filter(err => err.field === field)
      .map(err => err.message)
      .shift();

  // Filter out schedule errors and remove the prefix
  const scheduleErrors = currentErrors
    .filter(err => err.field.includes('schedule.'))
    .map(err => ({
      ...err,
      field: err.field.substr(9),
    }));

  const requestErrors = currentErrors
    .filter(err => err.field.includes('action.request.'))
    .map(err => ({
      ...err,
      field: err.field.substr(15),
    }));

  return (
    <Form isLoading={isLoading} onSubmit={handleSubmit} onCancel={handleCancel}>
      <FormSection title="General">
        {edit === false ? (
          <>
            <FormControl fullWidth>
              <TextField
                required
                label="task Name:"
                value={currentValue.task_name}
                error={hasError('task_name')}
                helperText={getErrorMessage('task_name')}
                onChange={onChangeProp('task_name')}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                required
                label="group Name:"
                value={currentValue.group_name}
                error={hasError('group_name')}
                helperText={getErrorMessage('group_name')}
                onChange={onChangeProp('group_name')}
              />
            </FormControl>
          </>
        ) : (
          <Grid container className={classes.taskInfo}>
            <Grid item xs={6}>
              <Typography variant="caption">{'task name: '}</Typography>
              <Typography>{value.task_name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption">{'group name: '}</Typography>
              <Typography>{value.group_name}</Typography>
            </Grid>
          </Grid>
        )}

        <FormControl fullWidth style={{ marginBottom: 0 }}>
          <TextField
            multiline
            rows="3"
            label="description:"
            value={currentValue.description}
            error={hasError('description')}
            helperText={getErrorMessage('description')}
            onChange={onChangeProp('description')}
          />
        </FormControl>
      </FormSection>
      <FormSection title="Schedule:">
        <ConfigSchedule
          value={currentValue.schedule}
          errors={scheduleErrors}
          onChange={updateScheduleValue}
        />
      </FormSection>
      <FormSection
        title="HTTP Request:"
        floatingEl={
          useVisualComposer ? (
            <Button onClick={() => setUseVisualComposer(false)}>
              <CodeComposerIcon />
            </Button>
          ) : (
            <Button onClick={() => setUseVisualComposer(true)}>
              <VisualComposerIcon />
            </Button>
          )
        }
      >
        {useVisualComposer ? (
          <ConfigRestRequest
            value={currentValue.action.request}
            errors={requestErrors}
            onChange={updateRequestValue}
          />
        ) : (
          <JsonEditor
            value={currentValue.action.request}
            onChange={updateRequestValue}
          />
        )}
      </FormSection>
    </Form>
  );
};

TaskDetailsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  /**
   * when true, task name and group can not be changed
   */
  edit: PropTypes.bool,
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    }),
  ),
};

TaskDetailsForm.defaultProps = {
  edit: false,
  errors: [],
};

export default TaskDetailsForm;
