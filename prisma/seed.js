// prisma/seed.js
import mysql from 'mysql2/promise';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import moment from 'moment-timezone';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
	// 🔗 External DB connection
	const externalDb = await mysql.createConnection({
		host: process.env.EXTERNAL_DB_HOST,
		user: process.env.EXTERNAL_DB_USER,
		password: process.env.EXTERNAL_DB_PASS,
		database: process.env.EXTERNAL_DB_NAME,
	});

	// 🔗 Local DB connection derived from DATABASE_URL
	const url = new URL(process.env.DATABASE_URL);
	const localDb = await mysql.createConnection({
		host: url.hostname,
		port: url.port,
		user: url.username,
		password: url.password,
		database: url.pathname.replace('/', ''),
	});

  	// // --- Seed countries ---
	// const [countries] = await externalDb.execute('SELECT * FROM countries');
	// for (const country of countries) {
	// await prisma.countries.create({
	// 	data: {
	// 	name: country.name,
	// 	status: country.status || 'active',
	// 	created_at: country.created_at || new Date(),
	// 	updated_at: country.updated_at || new Date(),
	// 	deleted_at: country.deleted_at || null,
	// 	},
	// });
	// }

	// // --- Seed states ---
	// const [states] = await externalDb.execute('SELECT * FROM states');
	// for (const state of states) {
	// await prisma.states.create({
	// 	data: {
	// 	name: state.name,
	// 	country_id: state.country_id,
	// 	status: state.status || 'active',
	// 	created_at: state.created_at || new Date(),
	// 	updated_at: state.updated_at || new Date(),
	// 	deleted_at: state.deleted_at || null,
	// 	},
	// });
	// }

	// // --- Seed company types ---
	// const [company_types] = await externalDb.execute('SELECT * FROM company_types');
	// for (const companyType of company_types) {
	// await prisma.company_types.create({
	// 	data: {
	// 	id: companyType.type_id,
	// 	name: companyType.type_name,
	// 	description: companyType.type_description,
	// 	status: companyType.type_active === 1 ? 'active' : 'inactive',
	// 	created_at: companyType.created_at || new Date(),
	// 	updated_at: companyType.updated_at || new Date(),
	// 	deleted_at: companyType.deleted_at || null,
	// 	},
	// });
	// }

	// // --- Seed subdomains ---
	// const [subdomains] = await externalDb.execute('SELECT * FROM subdomain');
	// for (const domain of subdomains) {
	// 	const [owners] = await externalDb.execute(
	// 		`SELECT company_name, company_type_id FROM members WHERE subdomain_id = ? AND is_primary = 1 LIMIT 1`,
	// 		[domain.subdomain_id]
	// 	);
	// 	const owner = owners[0] || {};

	// 	await prisma.subdomains.create({
	// 		data: {
	// 			id: domain.subdomain_id,
	// 			name: owner.company_name || domain.subdomain_name,
	// 			domain: domain.subdomain_name,
	// 			company_type_id: owner.company_type_id || null,
	// 			theme_config: domain.css_value ? JSON.stringify(domain.css_value) : null,
	// 			status:'active',
	// 			regular_hours: domain.regular_hours || null,
	// 			week_start_day: domain.week_start_day || null,
	// 			created_at: domain.created_at || new Date(),
	// 			updated_at: domain.updated_at || new Date(),
	// 			deleted_at: domain.deleted_at || null,
	// 		},
	// 	});
	// }

	// // ----- Seed Timezone ------
	// const allTimezones = moment.tz.names();
	// for (const tz of allTimezones) {
	// 	// Get UTC offset for this timezone
	// 	const offset = moment.tz(tz).format('Z'); // Example: "-06:00"

	// 	await prisma.timezones.create({
	// 	data: {
	// 		name: tz,                                   // e.g., "America/Chicago"
	// 		utc: `(GMT${offset}) ${tz}`,                // e.g., "(GMT-06:00) America/Chicago"
	// 		status: "active",
	// 		created_at: new Date(),
	// 		updated_at: new Date(),
	// 		deleted_at: null,
	// 	},
	// 	});
	// }


  	//	--- Seed members + employee + admin_user tables ----
	// 1. Create super-admin
	// await prisma.users.create({
	// 	data: {
	// 		id: 9,
	// 		subdomain_id: 1,
	// 		first_name: 'Robert',
	// 		last_name: 'Barton',
	// 		email: 'bartondc@peakclinics.com',
	// 		password: "595e5014609f159c13074bd3e59f8958",
	// 		user_type: 'super_admin',
	// 	},
	// });
  	// // 2. Fetch members and employees from old database
	// const [members] = await externalDb.execute('SELECT * FROM members')
	// const [employees] = await externalDb.execute('SELECT * FROM employees');
	// const [timezones] = await localDb.execute('SELECT * FROM timezones');
	
	// for (const member of members) {
	// 	const employee = employees.find(e => e.parent_id === member.member_id);
	// 	const userType = member.is_primary === 1 ? 'po_user' : 'so_user';

	// 	// Find timezone id
	// 	const tz = timezones.find(t => t.name === member.timezone);
	// 	const time_zone_id = tz ? tz.id : null;

	// 	// Determine user status
	// 	const status = member.isactive === 1
	// 	? 'active'
	// 	: member.is_terminate === 1
	// 	? 'terminate'
	// 	: member.ban === 1
	// 	? 'ban'
	// 	: 'inactive';

	// 	// Normalize password
	// 	console.log(`👤 Seeding user: ${member.member_id}`);

	// 	// Insert user
	// 	await prisma.users.create({
	// 		data: {
	// 			id: member.member_id,
	// 			first_name: member.first_name,
	// 			last_name: member.last_name,
	// 			user_name: member.user_name,
	// 			email: member.email,
	// 			password: member.password,
	// 			mobile: member.mobile || null,
	// 			phone_number: member.phone || null,
	// 			address: member.address || null,
	// 			address_2: member.address2 || null,
	// 			city: member.city || null,
	// 			zip_code: member.zip || null,
	// 			gender: member.sex || null,
	// 			birth_date: safeDate(member.birth_date),
	// 			fax: member.fax || null,
	// 			pay_type: employee?.payment === 1 ? 'hourly' : employee?.payment === 2 ? 'flat_rate' : null,
	// 			position: employee?.position || null,
	// 			review_date: safeDate(member.review_date),
	// 			reimbursement: member.reimbursement || null,
	// 			date_employed: safeDate(member.date_employed),
	// 			hire_date: safeDate(member.hire_date),
	// 			salary: employee?.salary || null,
	// 			user_type: userType,
	// 			status: status,
	// 			profile_headshot: member.profile_headshot || null,
	// 			company_logo: member.image_name || null,
	// 			reminder_messenger_emails: member.reminder_messenger_emails === 1 ? 'yes' : 'no',
	// 			reminder_task_notification_emails: member.reminder_task_notification_emails === 1 ? 'yes' : 'no',
	// 			last_login: safeDate(member.last_login),
	// 			account_type: member.account_type || null,
	// 			subdomain_id: member.subdomain_id || null,
	// 			state_id: member.state_id || null,
	// 			country_id: member.country_id || null,
	// 			time_zone_id: time_zone_id || null,
	// 			department_id: employee?.department || null,
	// 			location_id: employee?.location || null,
	// 		},
	// 	});
	// }

	// // Step 2: Update owner_id for SO users
	// const soUsers = members.filter(m => m.is_primary !== 1 && m.owner_id);
	// for (const soUser of soUsers) {
	// 	await prisma.users.update({
	// 		where: { id: soUser.member_id },
	// 		data: { owner_id: soUser.owner_id },
	// 	});
	// 	console.log(`🔗 Updated owner_id for SO user: ${soUser.member_id} -> Owner: ${soUser.owner_id}`);
	// }

	// 3. Migrate admin_users
	const [adminUsers] = await externalDb.execute('SELECT * FROM admin_users WHERE user_id != 9');
	for (const admin of adminUsers) {
		// Always use a safe fallback password
		let rawPassword = admin.password;

		// Debug log to see what's coming in
		console.log("👤 Seeding user:", admin.user_id, "| Raw password:", rawPassword, "| Type:", typeof rawPassword);

		await prisma.users.create({
			data: {
				subdomain_id : 1,
				first_name: admin.first_name,
				last_name: admin.last_name,
				email: admin.email,
				password: rawPassword,
				user_type: 'admin',
				status: admin.active === 1 ? 'active' : 'inactive',
				owner_id : admin.user_id
			},
		});
  	}

	// --- Seed Departments ---
	// const [departments] = await externalDb.execute(`SELECT * FROM departments`);

	// for (const department of departments) {
	// 	// Get owner (subdomain_id) from external.members
	// 	const [ownerRows] = await externalDb.execute(
	// 		`SELECT subdomain_id FROM members WHERE member_id = ? LIMIT 1`,
	// 		[department.employer_id]
	// 	);
	// 	const owner = ownerRows[0];

	// 	if (owner && owner.subdomain_id) {
	// 		await prisma.departments.create({
	// 			data: {
	// 				id: department.department_id,
	// 				subdomain_id: owner.subdomain_id || null,
	// 				department_name: department.department_name,
	// 				created_at: department.created_at || new Date(),
	// 				updated_at: department.updated_at || new Date(),
	// 				deleted_at: department.deleted_at || null,
	// 			},
	// 		});
	// 	}
	// }

	// --- Seed Locations ---
	// const [locations] = await externalDb.execute(`SELECT * FROM locations`);

	// for (const location of locations) {
	// 	// Get owner (subdomain_id) from external.members
	// 	const [ownerRows] = await externalDb.execute(
	// 		`SELECT subdomain_id FROM members WHERE member_id = ? LIMIT 1`,
	// 		[location.employer_id]
	// 	);
	// 	const owner = ownerRows[0];

	// 	if (owner && owner.subdomain_id) {
	// 		await prisma.locations.create({
	// 			data: {
	// 				id: location.location_id,
	// 				subdomain_id: owner.subdomain_id,
	// 				location_name: location.location_name,
	// 				created_at: location.created_at || new Date(),
	// 				updated_at: location.updated_at || new Date(),
	// 				deleted_at: location.deleted_at || null,
	// 			},
	// 		});
	// 	}
	// }

  	console.log('Seeding completed!');

	// 🔥 Force all local tables to InnoDB
	const [tables] = await localDb.execute(`
		SELECT CONCAT('ALTER TABLE \`', table_name, '\` ENGINE=InnoDB;') AS sql_stmt
		FROM information_schema.tables
		WHERE table_schema = DATABASE()
		AND engine <> 'InnoDB';
	`);

	for (const row of tables) {
		console.log(`Running: ${row.sql_stmt}`);
		await localDb.execute(row.sql_stmt);
	}

	await externalDb.end();
	await localDb.end();
	}

main()
  .then(async () => {
    console.log('Data seeded & all tables converted to InnoDB ✅');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


function safeDate(value) {
  if (!value || value === "0000-00-00" || value === "0000-00-00 00:00:00") {
    return null;
  }
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}