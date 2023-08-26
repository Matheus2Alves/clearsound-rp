// Get platform specific interface object.
/*let platform = chrome ? chrome : browser;

// Setup extension.
document.addEventListener('DOMContentLoaded', function() {
	platform.tabs.query({active: true, currentWindow: true}, function(tabs) {
		// Get domain.
		let domain = tabs[0].url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im)[1];
		
		// Get input fields.
		let input = document.getElementById('interface').children;
		// Add input change event.
		for (let i = 0; i < input.length; i++) {
			input[i].addEventListener('change', function() {
				// Set value to other input field.
				for (let j = 0; j < input.length; j++) {
					if (input[j] === this) {
						continue;
					}
					input[j].value = this.value;
				}
				
				// Set volume level of tab.
				platform.runtime.sendMessage({ id: tabs[0].id, volume: this.value });
				// Store value level.
				let items = {};
				items[domain] = this.value;
				platform.storage.sync.set(items);
			});
		}
		// Add button click event.
		document.getElementById('stop').addEventListener('click', function() {
			// Set volume to default 100 to disable the system.
			platform.runtime.sendMessage( {id: tabs[0].id, volume: 100 });
			// Exit the window.
			window.close();
		});
		
		// Get volume level from storage.
		platform.storage.sync.get(domain, function(items) {
			// Apply volume level.
			let volume = items[domain];
			if (volume) {
				platform.runtime.sendMessage({ id: tabs[0].id, volume: volume });
			}
			// If no volume level given set default of 100.
			else {
				volume = 100;
			}
			
			// Apply volume to interface.
			for (let k = 0; k < input.length; k++) {
				input[k].value = volume;
			}
		});
	});
});
*/

// Get platform specific interface object.

let platform = chrome ? chrome : browser;

// Setup extension.
document.addEventListener('DOMContentLoaded', function() {
    platform.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        // Get domain.
        let domain = tabs[0].url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im)[1];

        // Get input fields.
        let input = document.getElementById('interface').children;
        let decibelInput = document.getElementById('decibels'); // Get the decibel input field
        
        // Add input change event for the decibel input field.
        decibelInput.addEventListener('change', function() {
            let decibels = parseFloat(decibelInput.value); // Parse the decibel value as a float
            let volume = calculateVolumeFromDecibels(decibels); // Convert decibels to volume
            setVolumeForAllInputs(input, volume); // Set the calculated volume to all input fields

            // Set volume level of tab.
            platform.runtime.sendMessage({ id: tabs[0].id, volume: volume });
            
            // Store value level.
            let items = {};
            items[domain] = volume;
            platform.storage.sync.set(items);
        });

        // Add input change event for the volume input fields.
        for (let i = 0; i < input.length; i++) {
            input[i].addEventListener('change', function() {
                // Set value to other input fields.
                for (let j = 0; j < input.length; j++) {
                    if (input[j] === this) {
                        continue;
                    }
                    input[j].value = this.value;
                }
                
                // Set volume level of tab.
                platform.runtime.sendMessage({ id: tabs[0].id, volume: this.value });
                // Store value level.
                let items = {};
                items[domain] = this.value;
                platform.storage.sync.set(items);
            });
        }
        
        // Add button click event.
        document.getElementById('stop').addEventListener('click', function() {
            // Set volume to default 100 to disable the system.
            platform.runtime.sendMessage({ id: tabs[0].id, volume: 100 });
            // Exit the window.
            window.close();
        });
        
        // Get volume level from storage.
        platform.storage.sync.get(domain, function(items) {
            // Apply volume level.
            let volume = items[domain];
            if (volume) {
                platform.runtime.sendMessage({ id: tabs[0].id, volume: volume });
            }
            // If no volume level given set default of 100.
            else {
                volume = 100;
            }
            
            // Apply volume to interface.
            for (let k = 0; k < input.length; k++) {
                input[k].value = volume;
            }
        });
    });
    
    // Calculate volume from decibels
    function calculateVolumeFromDecibels(decibels) {
        const referenceDecibels = 100;

		// Calcula a diferença em decibels entre o valor fornecido e o ponto de referência.
		const decibelDifference = decibels - referenceDecibels;

		// Calcula o volume resultante usando uma fórmula logarítmica.
		// Esta fórmula pode ser ajustada com base em dados de percepção auditiva real.
		const volume = 100 * Math.pow(10, decibelDifference / 20);

		// Garante que o valor do volume fique entre 0 e 100.
		return Math.min(Math.max(0, volume), 100);
    }

    // Set volume to all input fields
    function setVolumeForAllInputs(inputs, volume) {
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = volume;
        }
    }
});




