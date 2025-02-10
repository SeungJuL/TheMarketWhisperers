class ResponseDto:
    def __init__(self, success, message, data):
        self.success = success
        self.message = message
        self.data = data

    def to_dict(self):
        return {
            "success": self.success,
            "message": self.message,
            "data": self.data
        }

class ResponseUtil:
    @staticmethod
    def success(message, data):
        return ResponseDto(True, message, data).to_dict()
    
    @staticmethod
    def failure(message, data):
        return ResponseDto(False, message, data).to_dict()
    
    @staticmethod
    def error(message, data):
        return ResponseDto(False, message, data).to_dict()
