import http from "@/services/httpCommon.js";
export default {
    async categoryList() {
        return http.get("/categories");
    },
    async categoryCreate(data){
      return http.post("/categories", data);
    },
    async categoryDelete(id){
      return http.delete("/categories/"+ id);
    },
    async categoryEdit(id,edit){
      return http.put("/categories/"+ id,edit);
    },
  };
