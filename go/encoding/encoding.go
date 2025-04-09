package encoding

import (
	"fmt"
	"log"

	"github.com/speps/go-hashids"
)

var hashID *hashids.HashID

func InitHashids() {
	hd := hashids.NewData()
	hd.Salt = "AAaa123!!"
	hd.MinLength = 8
	var err error
	hashID, err = hashids.NewWithData(hd)
	if err != nil {
		log.Fatalf("Failed to initialize Hashids: %v", err)
	}
}

func EncodeID(id int) string {
	hash, err := hashID.Encode([]int{id})
	if err != nil {
		log.Printf("Failed to encode ID: %v", err)
		return ""
	}
	return hash
}

func DecodeID(hash string) (int, error) {
	ids, err := hashID.DecodeWithError(hash)
	if err != nil || len(ids) == 0 {
		return 0, fmt.Errorf("invalid hash")
	}
	return ids[0], nil
}
