package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/p2eengineering/kalp-sdk-public/kalpsdk"
)

// Project represents a crowdfunding project
type Project struct {
	ID           string  `json:"id"`
	Title        string  `json:"title"`
	Description  string  `json:"description"`
	Goal         float64 `json:"goal"`
	Raised       float64 `json:"raised"`
	Image        string  `json:"image"`
	Creator      string  `json:"creator"`
	WalletAddress string  `json:"walletAddress"` // Wallet to receive funds
	Timestamp    uint64  `json:"timestamp"`      // Unix timestamp (now uint64)
}

// SmartContract provides functions for managing projects
type SmartContract struct {
	kalpsdk.Contract
}

// Init is called during chaincode instantiation
func (sc *SmartContract) Init(ctx kalpsdk.TransactionContextInterface) error {
	// Initialization logic, if needed
	return nil
}

// CreateProject allows a user to create a new project
func (sc *SmartContract) CreateProject(ctx kalpsdk.TransactionContextInterface, id, title, description, image, creator, walletAddress string, goal float64) error {
	// Check if project already exists
	existing, err := ctx.GetState(id)
	if err != nil {
		return fmt.Errorf("failed to read project: %v", err)
	}
	if existing != nil {
		return fmt.Errorf("project with ID %s already exists", id)
	}

	// Get current blockchain timestamp (converted to uint64)
	timestamp := uint64(time.Now().Unix())

	// Create new project struct
	project := Project{
		ID:           id,
		Title:        title,
		Description:  description,
		Goal:         goal,
		Raised:       0, // Initialize raised amount to 0
		Image:        image,
		Creator:      creator,
		WalletAddress: walletAddress, // Store wallet address
		Timestamp:    timestamp,      // Store blockchain timestamp
	}

	// Convert project to JSON
	projectJSON, err := json.Marshal(project)
	if err != nil {
		return fmt.Errorf("failed to serialize project: %v", err)
	}

	// Store project on blockchain
	err = ctx.PutStateWithoutKYC(id, projectJSON)
	if err != nil {
		return fmt.Errorf("failed to store project: %v", err)
	}

	return nil
}

// GetProjectByID retrieves a project by its ID
func (sc *SmartContract) GetProjectByID(ctx kalpsdk.TransactionContextInterface, id string) (*Project, error) {
	projectJSON, err := ctx.GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read project: %v", err)
	}
	if projectJSON == nil {
		return nil, fmt.Errorf("project with ID %s does not exist", id)
	}

	var project Project
	err = json.Unmarshal(projectJSON, &project)
	if err != nil {
		return nil, fmt.Errorf("failed to deserialize project: %v", err)
	}

	return &project, nil
}

// GetAllProjects retrieves all projects from the ledger
func (sc *SmartContract) GetAllProjects(ctx kalpsdk.TransactionContextInterface) ([]*Project, error) {
	resultsIterator, err := ctx.GetStateByRange("", "")
	if err != nil {
		return nil, fmt.Errorf("failed to get projects: %v", err)
	}
	defer resultsIterator.Close()

	var projects []*Project
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var project Project
		err = json.Unmarshal(queryResponse.Value, &project)
		if err != nil {
			return nil, err
		}
		projects = append(projects, &project)
	}

	return projects, nil
}

