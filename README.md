# Gotedo backend coding assessment

const {first_name, last_name, email, title, text} = request.body();
		const file = request.file('_file'); // file handling

		if (!first_name || !last_name || !email || !title || !text) {
			return response.status(400).send('Incomplete fields! Add "first_name", "last_name", "email", "title", "text", and "file_path" fields to the request body');
		}
		
		if (file) {
			await file.move(Application.tmpPath('uploads'));
		}