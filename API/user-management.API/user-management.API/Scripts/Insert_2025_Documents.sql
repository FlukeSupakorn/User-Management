-- Insert documents with 2025 dates to test date filtering
-- Current date reference: June 15, 2025

-- Documents from TODAY (June 15, 2025)
INSERT INTO Documents (Title, Description, Date, CreatedDate, UpdatedDate) VALUES
('Daily Status Report', 'Today''s project status report covering current tasks, blockers, and progress updates for the team.', '2025-06-15 00:00:00.0000000', GETDATE(), NULL),
('Sprint Planning Notes', 'Sprint planning session notes for the upcoming sprint starting tomorrow, including story points and assignments.', '2025-06-15 00:00:00.0000000', GETDATE(), NULL);

-- Documents from THIS WEEK (June 9-15, 2025)
INSERT INTO Documents (Title, Description, Date, CreatedDate, UpdatedDate) VALUES
('Weekly Team Retrospective', 'Team retrospective document capturing lessons learned, improvements, and action items from this week.', '2025-06-09 00:00:00.0000000', GETDATE(), NULL),
('Code Review Guidelines Update', 'Updated code review guidelines and best practices document for the development team.', '2025-06-10 00:00:00.0000000', GETDATE(), NULL),
('Architecture Decision Record', 'ADR documenting the decision to migrate from monolithic to microservices architecture.', '2025-06-11 00:00:00.0000000', GETDATE(), NULL),
('Bug Triage Report', 'Weekly bug triage report listing critical issues, priorities, and assignments for resolution.', '2025-06-12 00:00:00.0000000', GETDATE(), NULL),
('Feature Release Notes v2.5', 'Release notes for version 2.5 including new features, improvements, and bug fixes.', '2025-06-13 00:00:00.0000000', GETDATE(), NULL),
('Infrastructure Monitoring Setup', 'Documentation for setting up infrastructure monitoring and alerting systems.', '2025-06-14 00:00:00.0000000', GETDATE(), NULL);

-- Documents from THIS MONTH (June 2025)
INSERT INTO Documents (Title, Description, Date, CreatedDate, UpdatedDate) VALUES
('Monthly Performance Review', 'June 2025 performance review summary for all team members including goals and achievements.', '2025-06-01 00:00:00.0000000', GETDATE(), NULL),
('Budget Analysis Report', 'Monthly budget analysis comparing actual expenses vs planned budget for June 2025.', '2025-06-02 00:00:00.0000000', GETDATE(), NULL),
('Customer Feedback Summary', 'Compilation of customer feedback received in June 2025 with action items for improvement.', '2025-06-03 00:00:00.0000000', GETDATE(), NULL),
('Security Audit Report', 'June 2025 security audit findings and recommendations for system hardening.', '2025-06-05 00:00:00.0000000', GETDATE(), NULL),
('Training Materials Update', 'Updated training materials for new employee onboarding process effective June 2025.', '2025-06-07 00:00:00.0000000', GETDATE(), NULL),
('Compliance Documentation', 'Updated compliance documentation to meet new regulatory requirements as of June 2025.', '2025-06-08 00:00:00.0000000', GETDATE(), NULL);

-- Documents from THIS YEAR (2025) but different months
INSERT INTO Documents (Title, Description, Date, CreatedDate, UpdatedDate) VALUES
('Q1 2025 Business Review', 'Quarterly business review document summarizing Q1 2025 performance, metrics, and goals achieved.', '2025-03-31 00:00:00.0000000', GETDATE(), NULL),
('Annual Development Roadmap', '2025 development roadmap outlining major features and milestones planned for the year.', '2025-01-05 00:00:00.0000000', GETDATE(), NULL),
('Technology Stack Assessment', 'Annual assessment of current technology stack with recommendations for 2025 upgrades.', '2025-02-15 00:00:00.0000000', GETDATE(), NULL),
('Employee Handbook 2025', 'Updated employee handbook with new policies and procedures effective January 2025.', '2025-01-01 00:00:00.0000000', GETDATE(), NULL),
('Disaster Recovery Plan', 'Comprehensive disaster recovery plan updated for 2025 including new backup procedures.', '2025-04-10 00:00:00.0000000', GETDATE(), NULL),
('Marketing Strategy 2025', 'Marketing strategy document outlining campaigns and initiatives for 2025.', '2025-01-20 00:00:00.0000000', GETDATE(), NULL),
('Product Roadmap Q2 2025', 'Product roadmap for Q2 2025 detailing upcoming features and enhancements.', '2025-04-01 00:00:00.0000000', GETDATE(), NULL),
('Partnership Agreement Draft', 'Draft partnership agreement with key vendors for 2025 collaboration projects.', '2025-05-10 00:00:00.0000000', GETDATE(), NULL),
('Innovation Lab Proposal', 'Proposal for establishing an innovation lab to drive R&D initiatives in 2025.', '2025-05-20 00:00:00.0000000', GETDATE(), NULL);

-- Future documents from later in 2025
INSERT INTO Documents (Title, Description, Date, CreatedDate, UpdatedDate) VALUES
('Year-End Planning Guide', 'Planning guide for year-end 2025 activities including closure procedures and 2026 preparation.', '2025-11-15 00:00:00.0000000', GETDATE(), NULL),
('Holiday Schedule 2025', 'Company holiday schedule for the remainder of 2025 including closure dates.', '2025-07-01 00:00:00.0000000', GETDATE(), NULL),
('Fall Product Launch Plan', 'Product launch plan for fall 2025 release including marketing and support strategies.', '2025-09-15 00:00:00.0000000', GETDATE(), NULL);