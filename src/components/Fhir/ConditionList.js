import React            from "react"
import PropTypes        from "prop-types"
import { CODE_SYSTEMS } from "../../lib/constants"
import Grid             from "./Grid"
import Date             from "./Date"
import { 
    getPath, 
    getCodeOrConcept, 
    highlightToggleButtonText,
    codeIsNLPInsight, 
    getInsightSource, 
    InsightSource 
} from "../../lib"
import moment           from "moment"
import InsightsDetailButton from "./InsightsDetailButton"

export default class ConditionList extends React.Component
{
    static propTypes = {
        settings: PropTypes.object.isRequired,
        resources: PropTypes.arrayOf(PropTypes.object)
    };

    // https://reactjs.org/docs/handling-events.html
    constructor(props) {
        super(props);
        this.state = { doHighlight: false }
        this.toggleHighlight = this.toggleHighlight.bind(this);
    }

    toggleHighlight() {
        this.setState(prevState => ({ 
            doHighlight: !prevState.doHighlight 
        }) );
    }

    render()
    {
        let recs   = this.props.resources || []
        let length = recs.length;

        return (
            <Grid
                rows={(recs || []).map(o => o.resource)}
                title={`${length} Condition${length === 1 ? "" : "s"}`}
                comparator={(a,b) => {
                    let dA = getPath(a, "onsetDateTime");
                    let dB = getPath(b, "onsetDateTime");
                    dA = dA ? +moment(dA) : 0;
                    dB = dB ? +moment(dB) : 0;
                    return dB - dA;
                }}
                cols={[
                    {
                        label: "Condition",
                        render: o => {
                            let name   = "-";
                            let code   = "-";
                            let system = "";

                            let highlight = "";
                            if ( this.state.doHighlight && codeIsNLPInsight(o.code) ) {
                                highlight = "bg-primary";
                            }

                            if (o.code) {
                                if (o.code.text) {
                                    name = o.code.text;
                                }
                                if (Array.isArray(o.code.coding) && o.code.coding.length) {
                                    let c = o.code.coding[0]

                                    system = c.system
                                    for (let key in CODE_SYSTEMS) {
                                        if (CODE_SYSTEMS[key].url === c.system) {
                                            system = `(${key})`;
                                            break;
                                        }
                                    }

                                    if (c.display) {
                                        name = c.display
                                    }
                                    if (c.code) {
                                        code = c.code
                                    }
                                }
                            }
                            return (
                                <div>
                                    <b>{ name }</b>
                                    <small className={highlight+" text-muted pull-right"}>
                                        { code } {system}
                                    </small>
                                </div>
                            )
                        }
                    },
                    {
                        label: <div className="text-center">Clinical Status</div>,
                        render: o => <div className="text-center">{ o.clinicalStatus ? getCodeOrConcept(o.clinicalStatus) : "-" }</div>
                    },
                    {
                        label : <div className="text-center">Verification Status</div>,
                        render: o => <div className="text-center">{ o.verificationStatus ? getCodeOrConcept(o.verificationStatus) : "-" }</div>
                    },
                    {
                        label: <div className="text-center">Onset Date</div>,
                        render : o => {
                            let onset = o.onsetDateTime || "";
                            return (
                                <div className="text-center">
                                    {
                                        onset ?
                                        <Date moment={o.onsetDateTime}/> :
                                        "-"
                                    }
                                </div>
                            );
                        }
                    },
                    {
                        label: <div className="text-center">
                            <button
                                title={highlightToggleButtonText}
                                onMouseUp={ this.toggleHighlight }
                                className="text-center"
                            >
                                <i className={"fa fa-lightbulb-o fa-bold"}/>
                            </button>
                        </div>,
                        render: o => {
                            if ( getInsightSource(o) != InsightSource.NONE ) {
                                return ( <InsightsDetailButton resource={o} settings={this.props.settings}/> )
                            } else {
                                return ( <div/> )
                            }
                        }
                    }
                ]}
            />
        )
    }
}