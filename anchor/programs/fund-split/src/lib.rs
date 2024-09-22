use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};

declare_id!("7A7YeRHr88T6u3yT5AxogRQFj3duCqXAt2ijx8CWbm1L");

#[program]
pub mod fund_split {
    use super::*;

    pub fn split_funds(ctx: Context<SplitFunds>, amount: u64) -> Result<()> {
        let author_amount = amount * 90 / 100;
        let platform_amount = amount - author_amount; // Remaining 10%

        // Transfer 90% to the author's token account
        token::transfer(
            ctx.accounts.into_transfer_to_author_context(),
            author_amount,
        )?;

        // Transfer 10% to the platform's token account
        token::transfer(
            ctx.accounts.into_transfer_to_platform_context(),
            platform_amount,
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct SplitFunds<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub payer_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub author_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub platform_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

impl<'info> SplitFunds<'info> {
    fn into_transfer_to_author_context(
        &self,
    ) -> CpiContext<'_, '_, '_, 'info, token::Transfer<'info>> {
        let cpi_accounts = token::Transfer {
            from: self.payer_token_account.to_account_info(),
            to: self.author_token_account.to_account_info(),
            authority: self.payer.to_account_info(),
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }

    fn into_transfer_to_platform_context(
        &self,
    ) -> CpiContext<'_, '_, '_, 'info, token::Transfer<'info>> {
        let cpi_accounts = token::Transfer {
            from: self.payer_token_account.to_account_info(),
            to: self.platform_token_account.to_account_info(),
            authority: self.payer.to_account_info(),
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }
}
