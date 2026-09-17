class apiResponse {
  constructor(statuscode, data , message = 'Request was successful') {
    this.status = statuscode;
    this.data = data;
    this.message = message;
    this.success = statuscode < 400; // Assuming status codes below 400 are successful
  }
}

export default apiResponse;