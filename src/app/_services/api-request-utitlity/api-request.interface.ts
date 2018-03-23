export interface ApiRequest {
	type: string;
	url: string;
	path: string;
	headers: any;
	params: any;
}