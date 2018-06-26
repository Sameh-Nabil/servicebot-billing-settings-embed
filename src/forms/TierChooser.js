import React from 'react';
import getSymbolFromCurrency from 'currency-symbol-map'



const Tier = (props) => {
    let {tier, plan, pickTier, isCurrent, isSelected} = props;
    let tierContent, tierButton;
    let currency = getSymbolFromCurrency(plan.currency)
    let tierPrice = plan.amount/100;
    if(plan.trial_period_days > 0){
        tierButton = "Try for Free"
    }else{
        tierButton = "Get Started"
    }
    if(plan.type === "subscription"){
        if(tier.unit){
            tierContent = <span>{currency}{tierPrice}/{tier.unit}<span className="_interval-name">/{plan.interval}</span></span>;
        }else{
            tierContent = <span>{currency}{tierPrice}<span className="_interval-name">/{plan.interval}</span></span>;
        }
        if(plan.amount == 0){
            tierContent = "Free";
        }
    }
    if(plan.type === "one_time"){
        if(plan.amount == 0){
            tierContent = "Free";
        }else{
            tierContent = `${currency}${tierPrice}`;
        }
    }
    if(plan.type === "custom"){
        tierContent = "Contact";
        tierButton = "Contact Sales";
    }
    tierButton = "Change Plan"
    return(
        <div className={`_tier ${isCurrent ? '_current' : ''} ${isSelected ? '_selected' : ''}`}>
            <h2 className="_name">{tier.name}</h2>
            <span className="_price">{tierContent}</span>
            {isCurrent && <button className="_selected-label buttons rounded" disabled>Current Plan</button>}
            {!isSelected && !isCurrent && <button onClick={pickTier(plan.id)} className="_select-tier buttons rounded">{tierButton}</button>}
            {isSelected && !isCurrent && <button onClick={props.changePlan} className="_confirm-tier buttons rounded">Confirm Plan</button>}
            <ul className="_feature-list">
                {tier.features.map(feature=> {
                    return (<li className="_item">{feature}</li>);
                })}
            </ul>
        </div>
    );
}



const IntervalPicker = (props)=> {

    return (
        <ul className="_selector">
            {props.intervals.sort((a, b) => {
                if(a === "year" || b === "one_time"){
                    return 1;
                }
                if(a === "one_time" || b === "year"){
                    return -1;
                }
                if(a === "month"){
                    return 1;
                }
                if(b === "month"){
                    return -1
                }
                if(a === "week"){
                    return 1
                }
                if(a === "day"){
                    return -1
                }

            }).map(interval => {
                let intervalClass = "_interval";
                if(props.currentInterval === interval){
                    intervalClass+=" _selected";
                }
                let intervalNames = {
                    "one_time" : "One Time",
                    "month" : "Monthly",
                    "year" : "Annually",
                    "day" : "Daily",
                    "week" : "Weekly"
                };

                return (<li className={intervalClass} onClick={props.changeInterval(interval)}>{intervalNames[interval]}</li>)
            })
            }
        </ul>
    );
};
class TierSelector extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            tiers: [],
            paymentPlans: {},
            currentInterval: null,
            currentPlan: props.currentPlan,
            selectedPlan: props.currentPlan
        }
        this.changeInterval = this.changeInterval.bind(this);
        this.pickTier = this.pickTier.bind(this);

    }

    pickTier(paymentPlan){
        let self = this;
        return function(e){
            self.setState({selectedPlan : paymentPlan});
        }
    }
    async componentDidMount() {
        let {template, currentPlan} = this.props;
        let metricProp = template.references.service_template_properties.find(prop => prop.type === "metric");
        let tiers = template.references.tiers;
        if(metricProp) {
            tiers = template.references.tiers.map(tier => {
                if (metricProp.config.pricing.tiers.includes(tier.name)) {
                    tier.unit = metricProp.config.unit;
                }
                return tier
            });
        }
        let currentInterval = null;
        let paymentPlans = tiers.reduce(( acc, tier) => {
            return acc.concat(tier.references.payment_structure_templates);
        }, []).reduce((acc, plan)=> {
            if(plan.id == currentPlan){
                currentInterval = plan.interval;
            }
            acc[plan.type] = [plan].concat(acc[plan.type] || []);
            return acc;
        }, {});
        this.setState({tiers, paymentPlans, currentInterval})
    }
    changeInterval(currentInterval){
        let self = this;
        return function(e){
            self.setState({currentInterval})
        }
    }
    render(){
        let {tiers, currentInterval, currentPlan, selectedPlan, paymentPlans : {subscription, custom, one_time}} = this.state;
        let currentPlans = custom || [];
        let intervals = new Set([]);
        console.log("CURRENT", currentPlan);
        let self = this;
        let checkoutConfig = {};
        if(one_time){
            intervals.add("one_time");
        }
        if(subscription){
            subscription.forEach(sub => {
                intervals.add(sub.interval);
            })
        }
        let intervalArray = Array.from(intervals);
        if(subscription && currentInterval !== "one_time"){
            subscription = subscription.sort((a, b) => {
                return b.amount - a.amount;
            }).reduce((acc, sub) => {
                acc[sub.interval] = [sub].concat(acc[sub.interval] || []);
                return acc;
            }, {});
            currentPlans = subscription[currentInterval || intervalArray[0]].concat(currentPlans);
        }
        if(currentInterval === "one_time"){
            one_time.sort((a, b)=> {
                return b.amount-a.amount;
            });
            currentPlans = one_time.concat(currentPlans);
        }

        return (
            <div>
                <div className="servicebot-billing-type-selector">
                    {currentInterval && currentInterval!== "custom" && <IntervalPicker changeInterval={this.changeInterval} currentInterval={currentInterval} intervals={intervalArray}/>}
                </div>
                {currentInterval !== "custom" && <div className="servicebot-pricing-table">
                    {currentPlans.map(plan => {
                        if(plan.interval === "custom"){
                            return <div></div>
                        }
                        let props = {
                            pickTier: self.pickTier,
                            key: plan.id,
                            tier: tiers.find(tier => tier.id === plan.tier_id),
                            plan: plan,
                            changePlan: self.props.changePlan(plan.id)
                        }

                        if (plan.id === currentPlan) {
                            props.isCurrent = true;
                        }
                        if (plan.id === selectedPlan) {
                            props.isSelected = true;
                        }
                        return <Tier {...props}/>
                    })}
                </div>
                }
                {currentInterval === "custom" && <p>Enterprise Plan</p>}

            </div>
        );
    }
}
export default TierSelector