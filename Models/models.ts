import { ObjectId } from 'mongodb';

/** Assignment Schema */
interface subAssignment {
	subjectName: string;
	assignmentNo: number;
	deadLine: Date;
	description: string;
	submittedStudents: ObjectId[];
}

export interface assignment {
	yearOfStudy: number;
	semester: number;
	branch: string;
	section: string;
	assignment: subAssignment[];
}

/** Attendance Schema */
export interface attendance {
	semester: number;
	yearOfStudy: number;
	noWorkingDays: number;
	absent: Date[];
}
/** User Schema */
interface Attendance {
	semester: number;
	yearOfStudy: number;
	noWorkingDays: number;
	absent: Date[];
}
export enum userType {
	'admin',
	'faculty',
}

export interface faculty {
	userType: userType;
	name: string;
	mobileNo: number | string;
	branch: string;
	empCode: string;
}
export interface student {
	userType: 'student';
	name: string;
	rollNo: string;
	yearOfStudy: number;
	semester: number;
	attendance?: Attendance;
	// marks
	mobileNo: number | string;
	branch: string;
	section: string;
}
