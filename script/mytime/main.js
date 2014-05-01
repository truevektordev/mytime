define(['mytime/model/modelRegistry', 'mytime/util/EnhancedMemoryStore'],
function(modelRegistry, EnhancedMemoryStore) {
    modelRegistry.set('timeEntryStore', EnhancedMemoryStore.createObservable());
});