# Mintlify Setup Instructions

## How to Connect Your Mintlify Site to Your GitHub Repository

Your Mintlify site at `https://quantumintelligence.mintlify.app/` needs to be connected to your GitHub repository to display your API documentation.

### Step 1: Access Mintlify Dashboard

1. Go to [https://dashboard.mintlify.com](https://dashboard.mintlify.com)
2. Sign in with your GitHub account

### Step 2: Connect Your Repository

1. In the Mintlify dashboard, click on your site (or create a new site)
2. Go to **Settings** → **Repository**
3. Click **Connect Repository** or **Change Repository**
4. Select your repository: `MGASALUCAS/docs`
5. Configure the following settings:
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `/` (or leave empty if your docs are in the root)
   - **Config File**: `docs.json`

### Step 3: Verify Configuration

Make sure your `docs.json` file is in the root of your repository and contains:
- Site name: "Mifumo SMS API"
- All navigation groups properly configured
- All page references are correct

### Step 4: Deploy

1. After connecting the repository, Mintlify will automatically deploy
2. Wait for the deployment to complete (usually 1-2 minutes)
3. Your site should now show your API documentation

### Step 5: Custom Domain (Optional)

If you want to use a custom domain:
1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow the DNS configuration instructions

## Troubleshooting

### Site Still Shows Default Content

1. **Check Repository Connection**: Ensure the repository is properly connected
2. **Check Branch**: Make sure you're deploying from the correct branch (`main`)
3. **Check Config File**: Verify `docs.json` is in the root directory
4. **Clear Cache**: Try redeploying from the Mintlify dashboard

### Files Not Found Errors

1. **Check File Paths**: Ensure all file paths in `docs.json` are correct
2. **Check File Extensions**: Make sure files use `.mdx` extension
3. **Check Case Sensitivity**: File paths are case-sensitive

### Deployment Fails

1. **Check Logs**: View deployment logs in Mintlify dashboard
2. **Validate docs.json**: Ensure JSON syntax is valid
3. **Check File References**: All referenced files must exist

## Your Repository Details

- **Repository**: `https://github.com/MGASALUCAS/docs.git`
- **Branch**: `main`
- **Config File**: `docs.json`
- **Root Directory**: `/` (root of repository)

## Quick Checklist

- [ ] Repository connected in Mintlify dashboard
- [ ] Branch set to `main`
- [ ] `docs.json` exists in root directory
- [ ] All MDX files referenced in `docs.json` exist
- [ ] Site deployed successfully
- [ ] Custom homepage (`index.mdx`) updated

## Need Help?

- Mintlify Documentation: https://mintlify.com/docs
- Mintlify Support: support@mintlify.com
- Your API Documentation: Check `/api-reference/introduction`

