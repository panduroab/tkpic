package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

const path = "tmp/golang/"

func uploadFile(w http.ResponseWriter, r *http.Request) {
	f, _, err := r.FormFile("file")
	if err != nil {
		panic(err)
	}
	defer f.Close()
	if _, err := os.Stat(path); os.IsNotExist(err) {
		os.MkdirAll(path, 0777)
	}
	filename := path + time.Now().String() + ".png"
	out, _ := os.Create(filename)
	defer out.Close()

	io.Copy(out, f)
	fmt.Fprint(w, "Upload complete")
}
func main() {
	http.Handle("/", http.FileServer(http.Dir("./client")))
	http.HandleFunc("/api/files/upload", uploadFile)
	http.ListenAndServe(":8080", nil)
}
