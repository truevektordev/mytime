define([
    'mytime/model/modelRegistry',
    'mytime/controller/TimeEntryController',
    'mytime/util/EnhancedMemoryStore'
], function(
    modelRegistry,
    TimeEntryController,
    EnhancedMemoryStore
) {
    modelRegistry.set('timeEntryStore', EnhancedMemoryStore.createObservable());
    new TimeEntryController();
});