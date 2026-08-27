"""add structured destinations to trips

Revision ID: f3a1c8e2b7d4
Revises: d040c736ae8e
Create Date: 2026-08-27

"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "f3a1c8e2b7d4"
down_revision: str | Sequence[str] | None = "d040c736ae8e"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "trips",
        sa.Column(
            "destinations",
            sa.JSON(),
            nullable=False,
            server_default=sa.text("'[]'"),
        ),
    )
    op.alter_column("trips", "destinations", server_default=None)


def downgrade() -> None:
    op.drop_column("trips", "destinations")
