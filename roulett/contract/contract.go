package main

import (
	"encoding/json"
	"fmt"
	// "math/rand"
	"time"

	"github.com/p2eengineering/kalp-sdk-public/kalpsdk"
)

// Bet represents a roulette bet
type Bet struct {
	BetID       string  `json:"betId"`
	Player      string  `json:"player"`
	BetType     string  `json:"betType"`   // "odd", "even", or specific number
	BetNumber   int     `json:"betNumber"` // 0-36 (only applicable for exact number bets)
	BetAmount   uint64  `json:"betAmount"`
	Result      int     `json:"result"`
	Winnings    uint64  `json:"winnings"`
	SpinTime    uint64  `json:"spinTime"`
	IsSettled   bool    `json:"isSettled"`
}

// SmartContract provides functions for Roulette
type SmartContract struct {
	kalpsdk.Contract
}

// Init initializes the contract
func (sc *SmartContract) Init(ctx kalpsdk.TransactionContextInterface) error {
	return nil
}

// PlaceBet allows a user to place a bet
func (sc *SmartContract) PlaceBet(ctx kalpsdk.TransactionContextInterface, betId, player, betType string, betNumber int, betAmount uint64) error {
	// Validate bet type
	if betType != "odd" && betType != "even" && (betNumber < 0 || betNumber > 36) {
		return fmt.Errorf("invalid bet type or number")
	}

	// if betType != "odd" && betType != "even" && betType != "number" {
    //     return fmt.Errorf("Invalid bet type: must be 'odd', 'even', or 'number'")
    // }
    
    // // Ensure valid betNumber for "number" bet type
    // if betType == "number" && (betNumber < 0 || betNumber > 36) {
    //     return fmt.Errorf("Invalid bet number: must be between 0 and 36")
    // }


	// Ensure bet amount is valid
	if betAmount == 0 {
		return fmt.Errorf("bet amount must be greater than zero")
	}

	// Check if bet already exists
	existing, err := ctx.GetState(betId)
	if err != nil {
		return fmt.Errorf("failed to check existing bet: %v", err)
	}
	if existing != nil {
		return fmt.Errorf("bet with ID %s already exists", betId)
	}

	// Store bet
	bet := Bet{
		BetID:     betId,
		Player:    player,
		BetType:   betType,
		BetNumber: betNumber,
		BetAmount: betAmount,
		SpinTime:  uint64(time.Now().Unix()),
		IsSettled: false,
	}

	betJSON, err := json.Marshal(bet)
	if err != nil {
		return fmt.Errorf("failed to serialize bet: %v", err)
	}

	err = ctx.PutStateWithoutKYC(betId, betJSON)
	if err != nil {
		return fmt.Errorf("failed to store bet: %v", err)
	}

	return nil
}

// SpinWheel generates a random result and settles bets
func (sc *SmartContract) SpinWheel(ctx kalpsdk.TransactionContextInterface, betId string, playerSeed int) error {
	// Retrieve the bet
	betJSON, err := ctx.GetState(betId)
	if err != nil {
		return fmt.Errorf("failed to retrieve bet: %v", err)
	}
	if betJSON == nil {
		return fmt.Errorf("bet with ID %s does not exist", betId)
	}

	var bet Bet
	err = json.Unmarshal(betJSON, &bet)
	if err != nil {
		return fmt.Errorf("failed to deserialize bet: %v", err)
	}

	// Generate random spin result using time-based randomness
	randomSeed := time.Now().UnixNano() + int64(playerSeed)
	spinResult := int(randomSeed % 37) // Get value between 0-36

	// Determine winnings
	winnings := uint64(0)
	if (bet.BetType == "even" && spinResult%2 == 0) || (bet.BetType == "odd" && spinResult%2 == 1) {
		// Win on Odd/Even bet
		winnings = (bet.BetAmount * 80) / 100
	} else if bet.BetType == "number" && spinResult == bet.BetNumber {
		// Win on Exact Number bet
		winnings = (bet.BetAmount * 1800) / 100
	}

	// Update bet result and store winnings
	bet.Result = spinResult
	bet.Winnings = winnings
	bet.IsSettled = true

	// Store updated bet
	updatedBetJSON, err := json.Marshal(bet)
	if err != nil {
		return fmt.Errorf("failed to serialize updated bet: %v", err)
	}

	err = ctx.PutStateWithoutKYC(betId, updatedBetJSON)
	if err != nil {
		return fmt.Errorf("failed to update bet: %v", err)
	}

	// Players withdraw winnings via frontend API
	return nil
}

// GetBet retrieves details of a bet
func (sc *SmartContract) GetBet(ctx kalpsdk.TransactionContextInterface, betId string) (*Bet, error) {
	betJSON, err := ctx.GetState(betId)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve bet: %v", err)
	}
	if betJSON == nil {
		return nil, fmt.Errorf("bet with ID %s does not exist", betId)
	}

	var bet Bet
	err = json.Unmarshal(betJSON, &bet)
	if err != nil {
		return nil, fmt.Errorf("failed to deserialize bet: %v", err)
	}

	return &bet, nil
}


// GetAllBets retrieves all bets from the ledger
func (sc *SmartContract) GetAllBets(ctx kalpsdk.TransactionContextInterface) ([]*Bet, error) {
    resultsIterator, err := ctx.GetStateByRange("", "") // Fetch all records
    if err != nil {
        return nil, fmt.Errorf("failed to get bets: %v", err)
    }
    defer resultsIterator.Close()

    var bets []*Bet
    for resultsIterator.HasNext() {
        queryResponse, err := resultsIterator.Next()
        if err != nil {
            return nil, err
        }

        var bet Bet
        err = json.Unmarshal(queryResponse.Value, &bet)
        if err != nil {
            return nil, err
        }
        bets = append(bets, &bet)
    }

    return bets, nil
}

// func main() {
// 	contract := kalpsdk.Contract{IsPayableContract: false}
// 	chaincode, err := kalpsdk.NewChaincode(&SmartContract{contract})
// 	if err != nil {
// 		fmt.Printf("Error creating smart contract: %s", err)
// 		return
// 	}

// 	if err := chaincode.Start(); err != nil {
// 		fmt.Printf("Error starting smart contract: %s", err)
// 	}
// }