async function updateAccountInfo(connection, oldEmail, oldPassword, newEmail = null, newPassword = null, mbti = null, age = null, country = null, userGender = null) {
	const validation = await connection.execute(
		`SELECT *
		FROM LoginUser
		WHERE emailAddress = :oldEmail AND password = :oldPassword`,
		[oldEmail, oldPassword],
		{ autoCommit: true }
	);
	if (validation.rows.length > 0) {
		const username = validation.rows[0][0];
		let resultEmail = true;
		let resultPassword = true;
		let resultMBTI = true;
		let resultAge = true;
		let resultCountry = true;
		let resultGender = true;
		if (newEmail !== '') {
			const newEmailNotTaken = await connection.execute(
				`SELECT *
				FROM LoginUser
				WHERE emailAddress = :newEmail`,
				{newEmail},
				{ autoCommit: true }
			);
			if (newEmailNotTaken.rows.length > 0) {
				throw new Error("New email address is already taken by another user!");
			} else {
				resultEmail = await updateEmail(connection, username, newEmail);
			}
		}
		if (newPassword !== '') {
			resultPassword = await updatePassword(connection, username, newPassword);
		}
		if (mbti !== '') {
			resultMBTI = await updateMBTI(connection, username, mbti);
		}
		if (age !== '') {
			resultAge = await updateAge(connection, username, age);
		}
		if (country !== '') {
			resultCountry = await updateCountry(connection, username, country);
		}
		if (userGender !== '') {
			resultGender = await updateGender(connection, username, userGender);
		}

		return resultEmail && resultPassword && resultMBTI && resultAge && resultCountry && resultGender;
	} else {
		console.error('Old email and password are incorrect!');
		return false;
	}
}

async function updateEmail(connection, username, newEmail) {
	try {
		const result = await connection.execute(
			`UPDATE LoginUser SET emailAddress = :newEmail WHERE username = :username`,
			[newEmail, username],
			{ autoCommit: true }
		);

		return result.rowsAffected && result.rowsAffected > 0;
    } catch (err) {
		return false;
    }
}

async function updatePassword(connection, username, newPassword) {
    try {
		const result = await connection.execute(
			`UPDATE LoginUser SET password = :newPassword WHERE username = :username`,
			[newPassword, username],
			{ autoCommit: true }
		);

		return result.rowsAffected && result.rowsAffected > 0;
    } catch (err) {
        return false;
    }
}

async function updateMBTI(connection, username, newMBTI) {
    try {
		const result = await connection.execute(
			`UPDATE LoginUser SET mbtiName = :newMBTI WHERE username = :username`,
			[newMBTI, username],
			{ autoCommit: true }
		);

		return result.rowsAffected && result.rowsAffected > 0;
    } catch (err) {
        return false;
    }
}

async function updateAge(connection, username, newAge) {
    try {
		const result = await connection.execute(
			`UPDATE LoginUser SET age = :newAge WHERE username = :username`,
			[newAge, username],
			{ autoCommit: true }
		);

		return result.rowsAffected && result.rowsAffected > 0;
    } catch (err) {
        return false;
    }
}

async function updateCountry(connection, username, newCountry) {
    try {
		const result = await connection.execute(
			`UPDATE LoginUser SET country = :newCountry WHERE username = :username`,
			[newCountry, username],
			{ autoCommit: true }
		);

		return result.rowsAffected && result.rowsAffected > 0;
    } catch (err) {
        return false;
    }
}

async function updateGender(connection, username, newGender) {
    try {
		const result = await connection.execute(
			`UPDATE LoginUser SET userGender = :newGender WHERE username = :username`,
			[newGender, username],
			{ autoCommit: true }
		);

		return result.rowsAffected && result.rowsAffected > 0;
    } catch (err) {
        return false;
    }
}

module.exports = {
    updateAccountInfo
}