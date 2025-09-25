'use client';

import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

interface ProcedureSection {
  id: string;
  title: string;
  content: string;
  subsections?: ProcedureSection[];
}

const procedureSections: ProcedureSection[] = [
  {
    id: 'definitions',
    title: 'DEFINITIONS',
    content: '',
    subsections: [
      {
        id: 'custom-security-bond',
        title: 'CUSTOM SECURITY BOND',
        content: `It is a contract executed under seal whereby the party or parties entering into it bind themselves to pay to some other person or body a specified sum of money, referred to as the penalty to the bond, if any of the conditions of the bond are not satisfied. The obligation in all security bonds is joint and several.`
      },
      {
        id: 'principal',
        title: 'PRINCIPAL',
        content: `The person who undertakes to fulfil the conditions of the bond and pay the penalty of the bond if any of the conditions of the bond are not satisfied. They are normally the importers or their agents.`
      },
      {
        id: 'surety',
        title: 'SURETY/GUARANTORS',
        content: `The person who undertakes to pay the bond if the principal fails to fulfil the conditions of the bond. These are normally the insurance companies or banking institutions.`
      }
    ]
  },
  {
    id: 'classification',
    title: 'CLASSIFICATION OF SECURITY BONDS',
    content: `There are two types of security bonds, general security bonds and particular security bonds.`,
    subsections: [
      {
        id: 'general-security-bond',
        title: 'GENERAL SECURITY BOND',
        content: `This is a bond executed in accordance with EACCMA (2004). It is valid for a period of three years and can be replenished. It is executed either as a Regional Customs Transit Guarantee (RCTG) for COMESA or for a General Customs Security Bond (GCSB) for sensitive goods and non-COMESA countries.`
      },
      {
        id: 'particular-security-bond',
        title: 'PARTICULAR SECURITY BOND',
        content: `It is a single transaction bond and is valid for 12 months.`
      }
    ]
  },
  {
    id: 'security-bond-guarantees',
    title: 'SECURITY BOND GUARANTEES',
    content: `Security may be given to the satisfaction of the Commissioner either;`,
    subsections: [
      {
        id: 'cash-guarantee',
        title: 'a) Cash guarantee (by cash)',
        content: ``
      },
      {
        id: 'bank-guarantee',
        title: 'b) Bank guarantee (by bank)',
        content: ``
      },
      {
        id: 'insurance-guarantee',
        title: 'c) Insurance guarantee (by Insurance)',
        content: ``
      },
      {
        id: 'other-guarantee',
        title: 'd) Any other form of security that the Commissioner may allow (e.g. token bond)',
        content: ``
      },
      {
        id: 'bank-guarantee-details',
        title: 'BANK GUARANTEE',
        content: `This is a requirement for payment under dispute where the principal decides to execute a bond (of the amount in dispute) instead of paying in cash. Its validity depends on the use.`
      }
    ]
  },
  {
    id: 'procedure-execution',
    title: 'PROCEDURE FOR BONDS EXECUTION',
    content: '',
    subsections: [
      {
        id: 'simba-icms',
        title: 'SIMBA iCMS',
        content: ``,
        subsections: [
          {
            id: 'apply-bond-simba',
            title: 'APPLY FOR A BOND',
            content: `The Principal will apply for a bond in Kentrade. The Principal shall fill the relevant form depending on the type of bond he/she wants to execute, and comply with insurance or bank requirements.`
          },
          {
            id: 'apply-bond-icms',
            title: 'APPLY FOR A BOND',
            content: `The Principal will apply for a bond in iCMS. In the case of Bank Guarantee, the Clearing agent makes the application for the bond on behalf of the principal.`
          },
          {
            id: 'kentrade-confirmation',
            title: 'KENTRADE CONFIRMATION',
            content: `The agent shall lodge the bond with Bonds Management Unit for Kentrade Confirmation`
          },
          {
            id: 'review-bond-application',
            title: 'REVIEW BOND APPLICATION',
            content: `Bond registration officer reviews the bond application after which the bond details are submitted via Bonds Module in ICMS to the KENSWITCH system. A copy of the Bond form with details of the bond application is sent via email to the Guarantor.`
          },
          {
            id: 'witnessing-bond',
            title: 'WITNSESING BOND FOR APPROVAL',
            content: `The bonds shall then be referred to either officer, supervisor, assistant manager, manager or chief manager according to set limits for witnessing.`
          },
          {
            id: 'review-process-guarantor',
            title: 'REVIEW AND PROCESS GUARANTOR CONFIRMATION',
            content: `The Guarantor via the KENSWITCH system will approve or reject this application. The iCMS will receive feedback via KENSWITCH and proceed with internal recommendation and approval processes where there is approval from the guarantor.`
          },
          {
            id: 'approve-bond-recommend',
            title: 'APPROVE A BOND RECOMMEND BOND FOR APPROVAL',
            content: `The bonds shall then be referred to either officer, supervisor, assistant manager, manager or chief manager according to set limits for approval.`
          },
          {
            id: 'approval',
            title: 'APPROVAL',
            content: `Bond recommendation levels varies with the Bond Value and is in the systems parameters as per KRA requirements.`
          },
          {
            id: 'registering-numbering',
            title: 'REGISTERING AND NUMBERING',
            content: `After witnessing and approval the bonds are then numbered and entered in the register.`
          },
          {
            id: 'approve-bond',
            title: 'APPROVE A BOND',
            content: `Bond approval levels also varies with the bond value and is in the systems parameters as per KRA requirements.`
          },
          {
            id: 'execute-bond-simba',
            title: 'EXECUTE A BOND',
            content: `After review of all documents supporting the approved application and having obtained signed Bond agreement from both Principal/Guarantor, the Bond is ready for execution and for use in Simba system.`
          },
          {
            id: 'execute-bond-icms',
            title: 'EXECUTE A BOND',
            content: `After review of all documents supporting the approved application and having obtained signed Bond agreement from both Principal/Guarantor, the Bond is ready for execution and for use in iCMS.`
          }
        ]
      }
    ]
  },
  {
    id: 'documentary-requirements',
    title: 'DOCUMENTARY REQUIREMENTS/ATTACHMENTS (EXECUTION)',
    content: '',
    subsections: [
      {
        id: 'bond-requirements-table',
        title: 'BOND REQUIREMENTS TABLE',
        content: `BOND CATEGORY | BOND CLASS | DESCRIPTION | REQUIREMENTS

PART CB1 | Security bond for perishable items or provisional release where perfection is done within 48 hrs | -copy of invoice -authority letter -Valid for 48 hrs -specimen form f

PART CBIA | Security bond for provisional release of project goods where perfection be done within 90 days. The principal must obtain exemption letters from treasury within that period. | -copy of letter of -copy of invoice -valid for 90 day -specimen sign guarantor -master list

GEN CB2 | Security bond for movement of goods from one port to another The period is one month | -Authority letter -old CB2 bond -specimen sign guarantor

GEN CB3 | Security bond for warehousing of goods the transaction period is 14 days except for bulk cargo which is 21 days | -specimen sign guarantor

GEN CB4 | Bond for re- export from warehouse/after drawback. The transaction period is 30 days | -transaction peri -specimen sign guarantor

GEN CB5 | Security bond for ship store. The period is one month | -copy of invoice -valid for 1 year -specimen sign guarantor

GEN CB6 | Security bond for custody of goods in a licensed bonded warehouse Transaction period is one year | -general bond va -old CB6 bond -supplementary b -previous license -specimen form f

GEN CB8 | Security bond for transit goods. Transit period is 30 days. Application for bond cancellation - within 30 days of exit of goods Can be extended in special circumstances | -specimen sign guarantor -approval letter i

GEN CB8A | Regional Customs Transit Guarantee bond (RCTG) This is a COMESA regional customs transit bond Transaction period is 30 days | -specimen sign guarantor

GEN CB9 | Security bond for transhipment of goods The transaction period is 21 days | -Authority letter -specimen form f

PART CB10 | Security bond for temporary importation | -authority letter -valid for 1 year a -specimen sign guarantor

PART CB11 | Security bond for licensed custom agents. Transaction period is one year-the bond is tied to license | -cover letter from -specimen sign guarantor

GEN CB12 | Security bond for conveyance of goods It covers licensed vessels | -transit license -general bond -specimen sign guarantor -letter from licen

PART CB13 | Security bond for raw material for manufacture of goods for export and home use Transaction period is 12 months and renewable in special circumstance for other 6 months. | -copy of approva -specimen sign guarantor

GEN CB14(CPZ B) | Security bond for warehousing and removal of goods from EPZ and MUB. Warehousing period is 14 days for EPZA goods. | -Cover letter from -specimen sign guarantor

PART CB16 | Security bond for project goods. Transaction period is subject to completion of the project. It perfects CB1A. | -exemption lette -specimen sign guarantor

GEN CB18 | Security bond for goods in port or licensed transit sheds | -authority letter -old CB18 bond -general bond -specimen sign guarantor

PART STC | Security bond for goods moving out of a warehouse but will be returned after further works or exhibition. Bond mainly covers assembled vehicles for body building, conversions and exhibition Transaction period is 30-120 days Mainly covered under section 53 of EACCMA | -Letter of author -particular bond -specimen sign guarantor`
      }
    ]
  },
  {
    id: 'cancellation-retirement',
    title: 'PROCESS FOR CANCELLATION/RETIREMENT OF BONDS',
    content: '',
    subsections: [
      {
        id: 'simba-bonds',
        title: 'PROCESS FOR CANCELLATION/RETIREMENT OF SIMBA BONDS',
        content: `a) The principal/clearing agent lodges the physical bond cancellation voucher (Form C26) attaching all the necessary supporting documents at Bonds Section, Times Tower (as per the table below – Documentary attachments).

b) The C26 form is received, numbered, entered in the receiving register/allocation form and date stamped by the receiving clerk/officer.

c) The documents are then vetted by Bonds Cancellation Officer for compliance;
• If not compliant with the bonds cancellation requirements, the officer rejects the documents stating the reason for rejection on the documents. The documents are returned to the receiving officer/clerk who enters the details in the rejection register and issues them back to the principals/agents.
• If compliant with the bonds cancellation requirements, the officer cancels the bond transaction online in the Simba system.

d) For cancelled particular and retired general bonds, the documents proceeds through the process of typing of discharge letter to be issued to the principal/clearing agent who submits them to the guarantor for discharge of their liability.`
      },
      {
        id: 'icms-bonds',
        title: 'PROCESS FOR CANCELLATION/RETIREMENT OF iCMS BONDS',
        content: `a) Log in as an "Authorised system user"
b) On the left Navigation panel, Go To> "Bonds Management" > 'Search Bond''
c) Enter the "Bond ID" the click on "Search" ;
d) Next highlight the record then click on "Replenish Bond"
e) Next highlight the declaration f) and click on "Request Replenishment"
f) Next enter remarks in the resultant screen an click on "OK"
g) The system will generate a To Do task for the approving officer
h) The bonds cancellation officer will review the record details and "Approve Replenishment" or "Reject Replenishment" giving the reason for rejection.`
      }
    ]
  },
  {
    id: 'documentary-requirements-cancellation',
    title: 'DOCUMENTARY REQUIREMENTS/ATTACHMENTS CANCELLATION OF SIMBA SYSTEM ENTRIES',
    content: `CANCELLATION OF iCMS SYSTEM ENTRIES

Prior release - C402 Entry
• Provisional entry – C402
• Perfecting entry – C400 or C490
• Copy of exempting document (Pro 1B, Treasury exempting letter, etc.)

Security bond for perishable IM4 40402 Entry
• Perfecting entry, CPC IM4 474 timelines:
• 48 Hours (Section 36 (e) – b perishable goods).
• 90 Days for provisional releas • Copy of exempting document etc.) must be attached on appl • All packages must have been s • Once replenishment is done, tr retirement online and then pr for issuance of discharge lette

Prior release - C401 Entry
• Provisional entry – C401
• Perfecting entry – C490 or C493
• Treasury exempting letter
• Original triplicate CB1A bond
• Copy of CB16

Security bond for provisional re 40401 Entry
• Perfecting entry, CPC IM4 474 • Copy of exempting document etc.) must be attached on appl • All packages must have been s • Once replenishment is done, tr retirement online and then pr for issuance of discharge lette

Project Goods - C493 Entry
• Perfecting entry – C493
• Provisional entry - C401
• Original triplicate CB16 bond
• Copy CB1A
• Treasury exemption letter
• Completion letter from parent ministry

Security bond for project goods- • Project completion letter from • Export or payment of duties fo

Transit Goods - T810 Entry
• Transit T810 entry
• Striking entry T811 or T812 entry

Security bond for transit goods/ 80800/801/810/820/830
• Issuance of COE on TR8 8081

• All packages must have been a for those not exported)

Temporary Importation - C500/C510 Entry
• Temporary importation C500 or C510 entry
• Striking R3 entry
• Original triplicate CB10 Bond
• Temporary importation authorization letter

Security bond for tempor 50500/50510
• Issuance of COE on EX3 3736 • Authority letter for temporar application
• All packages on IM5 50500/ (exported or duty paid for tho

Duty Remission Scheme (DRS) – C422/ C491/ C492/ C494/ C496 Entry
• DRS C422/ C491/ C492/ C494/ C496 Entry
• Original triplicate CB13 bond
• DRS reconciliation/audit letter

Security bond for raw material export- Entry IM4 45492/45491/ • DRS Audit Letter confirming been accounted for

Warehousing or EPZ – W7 or R3 Entries
• Warehousing/EPZ - W7 or R3 entry

Security bond for the wareh warehoused goods - IM7 Entr • Issuance of F7 which must be • All packages must have been r

Bond for re- export from wa EX3 30300
• Issuance of COE
• All packages must have been a for those not exported)

Security bond for ship store- Ent • Issuance of COE
• All packages must have been a for those not exported)

Transhipment – M9 Entry
• Transhipment M9 entry

Security bond for transhipment • Issuance of COE on IM9
• All packages must have been a for those not exported)`
  },
  {
    id: 'retirement-bonds',
    title: 'RETIREMENT OF BONDS',
    content: '',
    subsections: [
      {
        id: 'retirement-simba',
        title: 'RETIREMENT OF SIMBA SYSTEM BONDS',
        content: `Bond for Removal Coastwise – CB2
Bond for Licensed Bonded Warehouse - CB6
Bond for Licensed Clearing Agent - CB11
Bond for Licensed Vessels - CB12
Bond for Licensed Transit sheds - CB18
• Original Triplicate Bond (being retired)
• Copy of its replacement bond`
      },
      {
        id: 'retirement-icms',
        title: 'RETIREMENT OF iCMS SYSTEM BONDS',
        content: `Bond for Removal Coastwise – CB2
Bond for Licensed Bonded Warehouse - CB6
Bond for Licensed Clearing Agent - CB11
Bond for Licensed Vessels - CB12
Bond for Licensed Transit sheds - CB18
• Original Triplicate Bond (being retired)
• Copy of its replacement bond

Bond for Perishable items – CB1
Bond for Warehousing Import and Removal – CB3
Bond for Re-export from Warehouse – CB4
Bond for Ship stores – CB5
Bond for Transit Goods – CB8
COMESA RCTG Bond – CB8A
Bond for Transhipment goods – CB9
Bond for Temporary Importation – CB10
Bond for Warehousing and Removal from EPZ – CPZB
• Original Triplicate Bond (being retired)
• All bond transactions are cancelled

Bond for Perishable items – CB1
Bond for Warehousing Import and Removal – CB3
Bond for Re-export from Warehouse – CB4
Bond for Ship stores – CB5
Bond for Transit Goods – CB8
COMESA RCTG Bond – CB8A
Bond for Transhipment goods – CB9
Bond for Temporary Importation – CB10
Bond for Warehousing and Removal from EPZ – CPZB
• Original Triplicate Bond (being retired)
• All bond transactions are cancelled`
      }
    ]
  }
];

export default function BondsProcedurePage() {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['definitions']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleSubsection = (sectionId: string, subsectionId: string) => {
    const newExpanded = new Set(expandedSections);
    const fullId = `${sectionId}-${subsectionId}`;
    if (newExpanded.has(fullId)) {
      newExpanded.delete(fullId);
    } else {
      newExpanded.add(fullId);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />

      {/* Main Content */}
      <div className="pt-16 transition-all duration-300 min-h-screen">
        <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold">KRA Bonds Procedure Manual</h1>
                <p className="text-sm text-gray-500">
                  ISO 9001:2015 CERTIFIED - Official KRA Customs Bonds Procedures
                </p>
              </div>
            </div>

            <a
              href="/Bond-Procedures.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Download Original PDF
            </a>
          </div>

          {/* Procedure Content */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">KENYA REVENUE AUTHORITY</h2>
                <p className="text-sm text-gray-600">Customs Bonds Procedures Manual - Complete Reference Guide</p>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {procedureSections.map((section) => (
                <div key={section.id} className="border-gray-200">
                  {/* Main Section */}
                  <div className="p-6">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                      {expandedSections.has(section.id) ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </button>

                    {expandedSections.has(section.id) && (
                      <div className="mt-4">
                        {section.content && (
                          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line mb-6">
                            {section.content}
                          </div>
                        )}

                        {/* Subsections */}
                        {section.subsections && section.subsections.length > 0 && (
                          <div className="space-y-4">
                            {section.subsections.map((subsection) => (
                              <div key={subsection.id} className="border-l-2 border-blue-200 pl-4">
                                <button
                                  onClick={() => toggleSubsection(section.id, subsection.id)}
                                  className="w-full flex items-center justify-between text-left"
                                >
                                  <h4 className="text-md font-medium text-gray-800">{subsection.title}</h4>
                                  {expandedSections.has(`${section.id}-${subsection.id}`) ? (
                                    <ChevronDown className="h-4 w-4 text-gray-500" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-gray-500" />
                                  )}
                                </button>

                                {expandedSections.has(`${section.id}-${subsection.id}`) && (
                                  <div className="mt-2 prose prose-sm max-w-none text-gray-600 whitespace-pre-line">
                                    {subsection.content}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                For additional assistance with customs bonds, contact your nearest KRA customs office.
              </p>
              <div className="flex justify-center gap-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Contact KRA
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Visit KRA Website
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


