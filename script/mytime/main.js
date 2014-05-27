define([
    "mytime/model/modelRegistry",
    "mytime/model/TimeEntry", "mytime/model/Task",
    "mytime/controller/TimeEntryController", "mytime/controller/TaskController",
    "mytime/util/store/EnhancedMemoryStore",
    "mytime/persistence/LocalStorage",
    "mytime/mock-data"
], function(
    modelRegistry,
    TimeEntry, Task,
    TimeEntryController, TaskController,
    EnhancedMemoryStore,
    LocalStorage,
    mockData
) {
    modelRegistry.set("timeEntryStore", EnhancedMemoryStore.createObservable());
    modelRegistry.set("taskStore", EnhancedMemoryStore.createObservable());
    
    LocalStorage.loadStore("timeEntryStore", modelRegistry.get("timeEntryStore"), TimeEntry);
    LocalStorage.loadStore("taskStore", modelRegistry.get("taskStore"), TimeEntry);

    new TimeEntryController();
    new TaskController();

//    mockData();
});