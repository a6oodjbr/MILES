"""remove legacy destination from trips

Revision ID: a8c4e1f2d6b7
Revises: f3a1c8e2b7d4
Create Date: 2026-08-27

"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "a8c4e1f2d6b7"
down_revision: str | Sequence[str] | None = "f3a1c8e2b7d4"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.drop_column("trips", "destination")


def downgrade() -> None:
    op.add_column(
        "trips",
        sa.Column("destination", sa.String(length=150), nullable=True),
    )
