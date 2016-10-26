(function(m) {

	function syncChanges(list, ref) {
		ref.on('child_added', function _add(snap, prevChild) {
	    	var data = snap.val();
	    	data.$id = snap.key; // assumes data is always an object
	    	var pos = positionAfter(list, prevChild);
	    	m.startComputation();
	    	list.splice(pos, 0, data);
	    	m.endComputation();
	  	});
	  	ref.on('child_removed', function _remove(snap) {
    		var i = positionFor(list, snap.key);
    		if( i > -1 ) {
    			m.startComputation();
      			list.splice(i, 1);
      			m.endComputation();
    		}
  		});

  		ref.on('child_changed', function _change(snap) {
    		var i = positionFor(list, snap.key);
    		if( i > -1 ) {
    			m.startComputation();
      			list[i] = snap.val();
      			list[i].$id = snap.key; // assumes data is always an object
      			m.endComputation();
    		}
  		});

  		ref.on('child_moved', function _move(snap, prevChild) {
    		var curPos = positionFor(list, snap.key);
    		if( curPos > -1 ) {
      			var data = list.splice(curPos, 1)[0];
      			var newPos = positionAfter(list, prevChild);
      			m.startComputation();
      			list.splice(newPos, 0, data);
      			m.endComputation();
    		}
  		});
	}

	// similar to indexOf, but uses id to find element
	function positionFor(list, key) {
	  	for(var i = 0, len = list.length; i < len; i++) {
	    	if( list[i].$id === key ) {
	      		return i;
	    	}
	  	}
	  	return -1;
	}

	// using the Firebase API's prevChild behavior, we
	// place each element in the list after it's prev
	// sibling or, if prevChild is null, at the beginning
	function positionAfter(list, prevChild) {
	  	if( prevChild === null ) {
	    	return 0;
	  	} else {
	    	var i = positionFor(list, prevChild);
	    	if( i === -1 ) {
	      		return list.length;
	    	} else {
	      		return i+1;
	    	}
	  	}
	}

	function wrappedArray(list, firebaseRef) {
   		var _proto = Array.prototype;

   		return {
   			add: function(data, priority) {
	      		var key = firebaseRef.push(data);
	      		if(priority) {
	      			this.setPriority(key, priority);
	      		}
	      		return key;
	   		},
				remove: function(key) {
	     		firebaseRef.child(key).remove();
	   		},
	   		get: function(key) {
	   			var i = positionFor(list, key);
	   			return (i > -1) ? list[i]: null;
	   		},
	   		set: function(key, newData, priority) {
	     		// make sure we don't accidentally push our $id prop
	     		if( newData.hasOwnProperty('$id') ) { 
	     			delete newData.$id; 
	     		}
	     		if (priority) {
	     			firebaseRef.child(key).setWithPriority(newData, priority);
	     		} else {
	     			firebaseRef.child(key).set(newData);
	     		}
	   		},
	   		setPriority: function(key, priority) {
	   			firebaseRef.child(key).setPriority(priority);
	   		},
	   		first: function() {
	   			return (list.length > -1) ? list[0] : null;
	   		},
	   		at: function(index) {
	   			return list[index] || null;
	   		},
	   		last: function() {
	   			return (list.length>0) ? list[list.length - 1] : null;
	   		},
	   		indexOf: function(key) {
	     		return positionFor(list, key); // positionFor in examples above
	   		},
	   		filter: function(callback) {
	   			return wrappedArray(_proto.filter.call(list, callback));
	   		},
	   		find: function(callback) {
	   			return list.filter(callback)[0];
	   		},
				reverse: function(){
					return list.reverse();
				},
	   		length : list.length, 
	   		forEach: _proto.forEach.bind(list),
	   		map    : _proto.map.bind(list),   			
   			reduce : _proto.filter.bind(list),
   			unload: function() {
   				firebaseRef.off('child_added');
	  			firebaseRef.off('child_removed');
  				firebaseRef.off('child_changed');
  				firebaseRef.off('child_moved');
   			}
		};
	}

	function getSyncArray(firebaseRef) {
  		var list = [];
  		syncChanges(list, firebaseRef);
  		return wrappedArray(list, firebaseRef);
	}

	m.firebase = getSyncArray;

}(m));
