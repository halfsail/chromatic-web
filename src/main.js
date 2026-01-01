// ...existing code...

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/service-worker.js')
		.then(() => {
			console.log('Service Worker registered successfully.');
		})
		.catch(error => {
			console.error('Service Worker registration failed:', error);
		});
}

// ...existing code...
{"version":"0.2.5","deviceId":null,"lastSync":null,"state":"completed","isAnimating":false,"puzzle":{"completed":true,"hints":0,"moves":10,"completedAt":"2025-12-28T07:08:38.024Z","col":4,"row":5,"date":"2025-12-28","hues":["#2be5a6","#b5ffc7","#f37ef9","#904ca7"],"history":["#2be5a6","#5fefb3","#8cf7bd","#b5ffc7","#41daaf","#7ad7b8","#96d5bc","#acd4bf","#59cdb9","#6dc3b9","#84b8b8","#a3a9b8","#75bfc5","#80aabf","#8d94b8","#9a7cb0","#f37ef9","#d16ddd","#b05cc2","#904ca7"],"locks":[13,6,8,15,16,0,19,17,3,2,1,7,14,12,10,9,5,4],"palette":["#2be5a6","#5fefb3","#8cf7bd","#b5ffc7","#41daaf","#7ad7b8","#96d5bc","#acd4bf","#59cdb9","#6dc3b9","#84b8b8","#a3a9b8","#75bfc5","#80aabf","#8d94b8","#9a7cb0","#f37ef9","#d16ddd","#b05cc2","#904ca7"]},"stats":{"totalCompleted":1,"currentStreak":1,"bestStreak":1,"averageMoves":10,"completedDates":["2025-12-28"],"weekStartDate":"2025-12-23"},"settings":{"theme":"dark","soundEnabled":false,"hapticEnabled":true,"relaxedMode":true,"difficulty":"easy"}}
