define([
    'mytime/model/modelRegistry',
    'mytime/controller/TimeEntryController', 'mytime/controller/TaskController',
    'mytime/util/EnhancedMemoryStore',
    'mytime/mock-data'
], function(
    modelRegistry,
    TimeEntryController, TaskController,
    EnhancedMemoryStore,
    mockData
) {
    modelRegistry.set('timeEntryStore', EnhancedMemoryStore.createObservable());
    modelRegistry.set('taskStore', EnhancedMemoryStore.createObservable());
    new TimeEntryController();
    new TaskController();

    mockData();
});