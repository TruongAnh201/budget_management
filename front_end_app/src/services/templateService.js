import http from "@/services/httpCommon.js";
export default {
    async templateList() {
        return http.get("/templates");
    },
    async templateCreate(data){
      return http.post("/templates", data);
    },
    async templateDelete(id){
      return http.delete("/templates/"+ id);
    },
    async templateEdit(id,edit){
      return http.put("/templates/"+ id,edit);
    },
  };
