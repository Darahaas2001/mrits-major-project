import { ObjectId } from 'mongodb';

/** Subject Schema */
export interface subject {
	subjectCode: string;
	subjectName: string;
	regulation: string;
	yearOfStudy: number;
	semester: number;
	branch: string;
}

/** Assignment Schema */
interface subAssignment {
	subjectCode: string; //ref
	deadLine: Date;
	description: string;
	submittedStudents: ObjectId[]; //ref
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
export interface userType {
	admin: 'admin';
	faculty: 'faculty';
	student: 'student';
}

export interface faculty {
	userType: userType;
	name: string;
	mobileNo: number | string;
	branch: string;
	empCode: string;
	teachingSubjects: { subjectCode: string; section: string }[]; //ref
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
