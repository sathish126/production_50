#!/bin/bash

# Production-50 Backend Development Setup Script
# This script automates the development environment setup

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    print_status "Checking Node.js installation..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js found: $NODE_VERSION"
        
        # Check if version is 16 or higher
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR" -lt 16 ]; then
            print_error "Node.js version 16 or higher required. Current: $NODE_VERSION"
            exit 1
        fi
    else
        print_error "Node.js not found. Please install Node.js 16+ from https://nodejs.org"
        exit 1
    fi
}

# Check if PostgreSQL is installed
check_postgresql() {
    print_status "Checking PostgreSQL installation..."
    if command -v psql &> /dev/null; then
        PG_VERSION=$(psql --version | awk '{print $3}')
        print_success "PostgreSQL found: $PG_VERSION"
    else
        print_warning "PostgreSQL not found locally"
        print_status "You can use a cloud database instead (Railway, Supabase, AWS RDS)"
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing Node.js dependencies..."
    npm install
    print_success "Dependencies installed successfully"
}

# Setup environment file
setup_environment() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_success "Created .env file from .env.example"
        else
            print_status "Generating .env file..."
            node scripts/test-services.js --generate-env
        fi
        
        print_warning "Please update .env file with your actual credentials:"
        print_status "  - Database connection string"
        print_status "  - SendGrid API key"
        print_status "  - Razorpay credentials"
        print_status "  - AWS S3 credentials"
    else
        print_success ".env file already exists"
    fi
}

# Setup local database
setup_database() {
    print_status "Setting up database..."
    
    # Check if we can connect to the database
    if node -e "
        require('dotenv').config();
        const pool = require('./config/database');
        pool.query('SELECT 1', (err) => {
            if (err) {
                console.error('Database connection failed:', err.message);
                process.exit(1);
            } else {
                console.log('Database connection successful');
                process.exit(0);
            }
        });
    " 2>/dev/null; then
        print_success "Database connection verified"
        
        # Run migrations
        print_status "Running database migrations..."
        npm run migrate
        print_success "Database migrations completed"
        
        # Seed database
        print_status "Seeding database with sample data..."
        npm run seed
        print_success "Database seeded successfully"
    else
        print_error "Cannot connect to database"
        print_status "Please check your DATABASE_URL in .env file"
        print_status "Or set up a local PostgreSQL database"
    fi
}

# Test all services
test_services() {
    print_status "Testing service configurations..."
    node scripts/test-services.js
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    directories=("logs" "uploads" "temp")
    
    for dir in "${directories[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            print_success "Created directory: $dir"
        fi
    done
}

# Setup git hooks (optional)
setup_git_hooks() {
    if [ -d ".git" ]; then
        print_status "Setting up git hooks..."
        
        # Pre-commit hook to run tests
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit tests..."
npm run test
if [ $? -ne 0 ]; then
    echo "Tests failed. Commit aborted."
    exit 1
fi
EOF
        
        chmod +x .git/hooks/pre-commit
        print_success "Git pre-commit hook installed"
    fi
}

# Main setup function
main() {
    echo -e "${BLUE}"
    echo "🚀 Production-50 Backend Development Setup"
    echo "=========================================="
    echo -e "${NC}"
    
    # Check prerequisites
    check_node
    check_postgresql
    
    # Setup project
    install_dependencies
    create_directories
    setup_environment
    
    # Database setup (only if configured)
    if grep -q "postgresql://" .env 2>/dev/null; then
        setup_database
    else
        print_warning "Database URL not configured, skipping database setup"
    fi
    
    # Optional setups
    setup_git_hooks
    
    # Test configuration
    print_status "Testing service configurations..."
    if node scripts/test-services.js; then
        print_success "All services configured correctly!"
        
        echo -e "\n${GREEN}🎉 Setup completed successfully!${NC}"
        echo -e "\n${BLUE}Next steps:${NC}"
        echo "1. Update .env file with your actual credentials"
        echo "2. Run: npm run dev"
        echo "3. Visit: http://localhost:5000/health"
        echo -e "\n${BLUE}Useful commands:${NC}"
        echo "  npm run dev          - Start development server"
        echo "  npm run migrate      - Run database migrations"
        echo "  npm run seed         - Seed database with sample data"
        echo "  npm test             - Run tests"
        echo "  npm run test-services - Test service configurations"
        
    else
        print_error "Some services need configuration"
        print_status "Please check the errors above and update your .env file"
        print_status "Refer to docs/SETUP_GUIDE.md for detailed instructions"
    fi
}

# Handle command line arguments
case "${1:-}" in
    --help)
        echo "Production-50 Backend Setup Script"
        echo ""
        echo "Usage:"
        echo "  ./setup-dev.sh           Run full setup"
        echo "  ./setup-dev.sh --help    Show this help"
        echo "  ./setup-dev.sh --test    Test services only"
        echo ""
        exit 0
        ;;
    --test)
        test_services
        exit 0
        ;;
    *)
        main
        ;;
esac